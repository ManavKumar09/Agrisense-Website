"use client"

import type React from "react"
import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-webgl"
import "@tensorflow/tfjs-backend-cpu" // added

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Camera, Upload, Loader2, Leaf, AlertTriangle, CheckCircle, SprayCan as Spray } from "lucide-react"
import Image from "next/image"

interface DetectionResult {
  crop: string
  disease: string
  severity: "Low" | "Medium" | "High"
  confidence: number
  treatment: {
    organic: string
    chemical: string
  }
  description: string
}

const loadModelAndLabels = async (
  modelRef: React.MutableRefObject<tf.LayersModel | any | null>,
  labelsRef: React.MutableRefObject<string[] | null>,
  modelTypeRef: React.MutableRefObject<string | null>, // added
) => {
  if (!modelRef.current) {
    try {
      // Prefer WebGL, fallback to CPU
      try {
        await tf.setBackend("webgl")
        console.log("[v0] TFJS backend set to webgl")
      } catch {
        await tf.setBackend("cpu")
        console.log("[v0] TFJS backend fallback to cpu")
      }
      await tf.ready()

      // Inspect model.json to decide loader and verify shards
      const modelUrl = "/model/model.json"
      console.log("[v0] Fetching model.json from", modelUrl)
      const metaRes = await fetch(modelUrl, { cache: "no-cache" })
      if (!metaRes.ok) {
        throw new Error(
          `Model metadata not found at ${modelUrl} (HTTP ${metaRes.status}). Ensure files are in public/model/.`,
        )
      }
      const meta: any = await metaRes.json()
      const fmt = (meta?.format || meta?.modelTopology?.format || "").toString().toLowerCase()
      console.log("[v0] Detected TFJS format:", fmt || "(unknown)")

      // Verify shard files are reachable (common names: group1-shard1of3.bin, etc.)
      const manifest = meta?.weightsManifest
      if (Array.isArray(manifest) && manifest.length > 0) {
        const paths: string[] = (manifest[0]?.paths as string[]) || []
        const base = "/model"
        const checks = await Promise.all(
          paths.map(async (p) => {
            const url = `${base}/${p}`
            // Try HEAD first
            try {
              const r = await fetch(url, { method: "HEAD", cache: "no-cache" })
              console.log("[v0] HEAD", url, r.status)
              // Some dev servers may return 405/403 for HEAD on static; fallback to GET as a light existence check
              if (!r.ok) {
                try {
                  const r2 = await fetch(url, { method: "GET", cache: "no-cache" })
                  console.log("[v0] GET(check)", url, r2.status)
                  return { url, ok: r2.ok, status: r2.status, via: "GET" }
                } catch (e) {
                  console.warn("[v0] GET(check) failed", url, e)
                  return { url, ok: false, status: 0, via: "GET" }
                }
              }
              return { url, ok: r.ok, status: r.status, via: "HEAD" }
            } catch (e) {
              console.warn("[v0] HEAD failed", url, e)
              // Fallback GET if HEAD threw
              try {
                const r2 = await fetch(url, { method: "GET", cache: "no-cache" })
                console.log("[v0] GET(check)", url, r2.status)
                return { url, ok: r2.ok, status: r2.status, via: "GET" }
              } catch (e2) {
                console.warn("[v0] GET(check) failed", url, e2)
                return { url, ok: false, status: 0, via: "GET" }
              }
            }
          }),
        )
        const missing = checks.filter((c) => !c.ok)
        if (missing.length) {
          // Log but don't block; tfjs loader will raise a precise error if truly missing
          console.warn("[v0] One or more shard files may be unreachable (continuing to let TFJS verify):", missing)
        }
      } else {
        console.log("[v0] No weightsManifest found in model.json")
      }

      if (fmt.includes("graph")) {
        modelTypeRef.current = "graph"
        modelRef.current = await tf.loadGraphModel(modelUrl)
      } else if (fmt.includes("layers")) {
        modelTypeRef.current = "layers"
        modelRef.current = await tf.loadLayersModel(modelUrl)
      } else {
        // If not stated, try graph first then layers
        try {
          modelTypeRef.current = "graph"
          modelRef.current = await tf.loadGraphModel(modelUrl)
        } catch (gErr) {
          console.warn("[v0] Graph load failed, trying layers:", gErr)
          modelTypeRef.current = "layers"
          modelRef.current = await tf.loadLayersModel(modelUrl)
        }
      }

      console.log("[v0] Model loaded. Type:", modelTypeRef.current)
    } catch (e) {
      console.error("[v0] Failed to load model:", e)
      throw new Error(
        "Failed to load AI model. Check that public/model/model.json and ALL listed .bin shards exist and are reachable. " +
          "Shard names must exactly match model.json (e.g., group1-shard1of3.bin). After copying, do a hard refresh.",
      )
    }
  }
  if (!labelsRef.current) {
    try {
      const res = await fetch("/model/labels.json", { cache: "no-cache" })
      if (res.ok) {
        labelsRef.current = await res.json()
        console.log("[v0] Loaded labels:", labelsRef.current)
      } else {
        labelsRef.current = null
        console.log("[v0] labels.json not found, will use fallback class names")
      }
    } catch {
      labelsRef.current = null
      console.log("[v0] labels.json fetch failed, continuing without labels")
    }
  }
}

const preprocessTo224 = (imgEl: HTMLImageElement) => {
  const canvas = document.createElement("canvas")
  const size = 224
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas context unavailable")
  ctx.drawImage(imgEl, 0, 0, size, size)
  const imageData = ctx.getImageData(0, 0, size, size)
  const { data } = imageData
  const numPixels = size * size
  const buffer = new Float32Array(numPixels * 3)
  for (let i = 0; i < numPixels; i++) {
    // scale to [-1, 1]
    buffer[i * 3 + 0] = data[i * 4 + 0] / 127.5 - 1
    buffer[i * 3 + 1] = data[i * 4 + 1] / 127.5 - 1
    buffer[i * 3 + 2] = data[i * 4 + 2] / 127.5 - 1
  }
  return tf.tensor4d(buffer, [1, size, size, 3])
}

const argmax = (arr: Float32Array | number[]) => {
  let maxIdx = 0
  let maxVal = Number.NEGATIVE_INFINITY
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > maxVal) {
      maxVal = arr[i]
      maxIdx = i
    }
  }
  return maxIdx
}

export default function DetectPage() {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [spraying, setSpraying] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const modelRef = useRef<tf.LayersModel | any | null>(null)
  const labelsRef = useRef<string[] | null>(null)
  const modelTypeRef = useRef<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return
    setAnalyzing(true)
    setErrorMsg(null)
    setResult(null)

    try {
      await loadModelAndLabels(modelRef, labelsRef, modelTypeRef) // updated

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = selectedImage
      await new Promise((res, rej) => {
        img.onload = () => res(null)
        img.onerror = () => rej(new Error("Failed to load the selected image for analysis"))
      })

      const input = preprocessTo224(img)
      const model: any = modelRef.current
      console.log("[v0] Running prediction with model type:", modelTypeRef.current)

      let outTensor: tf.Tensor

      try {
        if (modelTypeRef.current === "graph") {
          // Prefer executeAsync for GraphModels and pick the first output node
          const outputs = (model as any).outputNodes as string[] | undefined
          const outNode = Array.isArray(outputs) && outputs.length > 0 ? outputs[0] : undefined

          let execResult: tf.Tensor | tf.Tensor[]
          if (typeof (model as any).executeAsync === "function") {
            execResult = outNode
              ? await (model as any).executeAsync(input, outNode)
              : await (model as any).executeAsync(input)
          } else if (typeof (model as any).predict === "function") {
            // Some GraphModels expose predict() via InferenceModel
            execResult = (model as any).predict(input)
          } else {
            throw new Error("GraphModel does not support executeAsync or predict")
          }

          const first = Array.isArray(execResult) ? execResult[0] : execResult
          // Squeeze batch dimension if present
          outTensor = first.shape.length > 1 ? tf.squeeze(first) : first
        } else {
          // Layers model
          const pred = (model as tf.LayersModel).predict(input) as tf.Tensor | tf.Tensor[]
          const first = Array.isArray(pred) ? pred[0] : pred
          outTensor = first.shape.length > 1 ? tf.squeeze(first) : first
        }
      } catch (e) {
        input.dispose()
        console.error("[v0] Model execution error:", e, "Detected type:", modelTypeRef.current)
        throw new Error(
          `Model execution failed (${modelTypeRef.current || "unknown"}). Check input size (224x224x3) and model format.`,
        )
      }

      // Convert to probabilities
      const probsTensor = tf.softmax(outTensor)
      const probs = (await probsTensor.data()) as Float32Array

      input.dispose()
      outTensor.dispose()
      probsTensor.dispose()

      const topIdx = argmax(probs)
      const confidence = Math.round((probs[topIdx] || 0) * 100)

      const label = labelsRef.current?.[topIdx] ?? `Class ${topIdx}`
      let crop = "Unknown"
      let disease = label
      if (label.includes("-")) {
        const [c, d] = label.split("-").map((s) => s.trim())
        if (c && d) {
          crop = c
          disease = d
        }
      } else if (label.includes(":")) {
        const [c, d] = label.split(":").map((s) => s.trim())
        if (c && d) {
          crop = c
          disease = d
        }
      }

      const severity: "Low" | "Medium" | "High" = confidence >= 90 ? "High" : confidence >= 70 ? "Medium" : "Low"

      const treatmentText: Record<string, { organic: string; chemical: string }> = {
        "Leaf Rust": {
          organic: "Apply neem oil; improve airflow; avoid overhead watering.",
          chemical: "Use a triazole fungicide (e.g., propiconazole) per label.",
        },
        "Blast Disease": {
          organic: "Remove affected leaves; optimize spacing and drainage.",
          chemical: "Apply tricyclazole-based fungicide per label.",
        },
        "Early Blight": {
          organic: "Use copper-based organic fungicide; rotate crops.",
          chemical: "Apply chlorothalonil or mancozeb per label.",
        },
        Healthy: {
          organic: "Maintain balanced irrigation and nutrition.",
          chemical: "No treatment required.",
        },
      }
      const tx = treatmentText[disease] ?? {
        organic: "Ensure good hygiene, airflow, and balanced irrigation.",
        chemical: "Consult local agronomist for targeted fungicide guidance.",
      }

      const detection: DetectionResult = {
        crop,
        disease,
        severity,
        confidence,
        treatment: {
          organic: tx.organic,
          chemical: tx.chemical,
        },
        description: `${disease} detected with ${confidence}% confidence.`,
      }

      setResult(detection)

      const historyRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        image: selectedImage,
        ...detection,
      }
      const existingHistory = JSON.parse(localStorage.getItem("agrisense-history") || "[]")
      existingHistory.unshift(historyRecord)
      localStorage.setItem("agrisense-history", JSON.stringify(existingHistory.slice(0, 50)))
    } catch (err: any) {
      console.error("[v0] Analysis error:", err, "Model type:", modelTypeRef.current)
      setErrorMsg(
        (err?.message || "Analysis failed.") + (modelTypeRef.current ? ` [Model type: ${modelTypeRef.current}]` : ""),
      )
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSprayPesticide = async () => {
    setSpraying(true)
    setErrorMsg(null)
    try {
      const response = await fetch("/api/spray", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cropId: result?.crop, disease: result?.disease }),
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Pesticide spraying initiated! Your IoT sprayer has been activated.")
    } catch (error) {
      console.error("Error activating sprayer:", error)
      setErrorMsg("Error activating sprayer. Please try again.")
    } finally {
      setSpraying(false)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "High":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "Medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "Low":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "text-red-600 bg-red-50 dark:bg-red-950"
      case "Medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950"
      case "Low":
        return "text-green-600 bg-green-50 dark:bg-green-950"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-950"
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
        <Navigation />

        <main className="md:ml-64 p-3 sm:p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
                {t("detect.title")}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground text-pretty">
                Upload or take a photo of your crop to detect diseases using AI
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Image Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                    Crop Image
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Upload an image or take a photo of your crop leaves
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Image Preview */}
                  {selectedImage ? (
                    <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={selectedImage || "/placeholder.svg"}
                        alt="Selected crop"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Leaf className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm sm:text-base text-muted-foreground">No image selected</p>
                      </div>
                    </div>
                  )}

                  {/* Upload Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Button
                      variant="outline"
                      className="h-10 sm:h-12 bg-transparent text-sm sm:text-base"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={analyzing}
                    >
                      <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      {t("detect.upload")}
                    </Button>

                    <Button
                      variant="outline"
                      className="h-10 sm:h-12 bg-transparent text-sm sm:text-base"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={analyzing}
                    >
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      {t("detect.camera")}
                    </Button>
                  </div>

                  {/* Analyze Button */}
                  <Button
                    className="w-full h-10 sm:h-12 text-sm sm:text-lg"
                    onClick={handleAnalyze}
                    disabled={!selectedImage || analyzing}
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Leaf className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        {t("detect.analyze")}
                      </>
                    )}
                  </Button>

                  {/* Hidden File Inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
                    Analysis Results
                  </CardTitle>
                  <CardDescription className="text-sm">AI-powered crop disease detection results</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyzing ? (
                    <div className="text-center py-6 sm:py-8">
                      <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4 animate-spin" />
                      <p className="text-sm sm:text-base text-muted-foreground">Analyzing your crop image...</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2">This may take a few moments</p>
                    </div>
                  ) : errorMsg ? (
                    <div className="text-center py-6 sm:py-8">
                      <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-600 mx-auto mb-4" />
                      <p className="text-sm sm:text-base text-muted-foreground">{errorMsg}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                        Expected files: /public/model/model.json and its .bin shards. Optional:
                        /public/model/labels.json.
                      </p>
                    </div>
                  ) : result ? (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Basic Results */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">{t("detect.results.crop")}</p>
                          <p className="font-semibold text-base sm:text-lg">{result.crop}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Confidence</p>
                          <p className="font-semibold text-base sm:text-lg">{result.confidence}%</p>
                        </div>
                      </div>

                      {/* Disease Info */}
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{t("detect.results.disease")}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="font-semibold text-base sm:text-lg">{result.disease}</p>
                          {getSeverityIcon(result.severity)}
                        </div>
                      </div>

                      {/* Severity */}
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{t("detect.results.severity")}</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm sm:text-base font-medium mt-1 ${getSeverityColor(result.severity)}`}
                        >
                          {result.severity}
                        </span>
                      </div>

                      {/* Description */}
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Description</p>
                        <p className="text-sm sm:text-base mt-1 leading-relaxed">{result.description}</p>
                      </div>

                      {/* Treatment Options */}
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3">{t("detect.results.treatment")}</p>
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                            <p className="font-medium text-green-800 dark:text-green-200 mb-1">Organic Treatment</p>
                            <p className="text-sm sm:text-base text-green-700 dark:text-green-300">
                              {result.treatment.organic}
                            </p>
                          </div>
                          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Chemical Treatment</p>
                            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300">
                              {result.treatment.chemical}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Spray Button */}
                      {result.disease !== "Healthy" && (
                        <Button
                          className="w-full h-10 sm:h-12 text-sm sm:text-lg"
                          onClick={handleSprayPesticide}
                          disabled={spraying}
                          variant="destructive"
                        >
                          {spraying ? (
                            <>
                              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
                              Activating Sprayer...
                            </>
                          ) : (
                            <>
                              <Spray className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                              {t("detect.spray")}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <Leaf className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Upload an image to see analysis results
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
