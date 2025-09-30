"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { History, Search, Filter, Calendar, Leaf, AlertTriangle, CheckCircle, Eye } from "lucide-react"
import Image from "next/image"

interface HistoryRecord {
  id: string
  date: string
  image: string
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

export default function HistoryPage() {
  const { t } = useLanguage()
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<HistoryRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null)

  useEffect(() => {
    // Load history from localStorage (in real app, this would be from Firebase)
    const savedHistory = localStorage.getItem("agrisense-history")
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory)
      setRecords(parsedHistory)
      setFilteredRecords(parsedHistory)
    } else {
      // Add some mock data for demonstration
      const mockData: HistoryRecord[] = [
        {
          id: "1",
          date: "2025-01-15T10:30:00Z",
          image: "/wheat-leaf-with-rust-disease.jpg",
          crop: "Wheat",
          disease: "Leaf Rust",
          severity: "Medium",
          confidence: 87,
          treatment: {
            organic: "Apply neem oil spray twice weekly",
            chemical: "Use fungicide containing propiconazole",
          },
          description: "Leaf rust detected on wheat leaves",
        },
        {
          id: "2",
          date: "2025-01-12T14:15:00Z",
          image: "/rice-plant-with-blast-disease.jpg",
          crop: "Rice",
          disease: "Blast Disease",
          severity: "High",
          confidence: 92,
          treatment: {
            organic: "Remove affected leaves and improve drainage",
            chemical: "Apply tricyclazole-based fungicide",
          },
          description: "Severe blast disease affecting rice plants",
        },
        {
          id: "3",
          date: "2025-01-10T09:45:00Z",
          image: "/healthy-corn-plant-leaves.jpg",
          crop: "Corn",
          disease: "Healthy",
          severity: "Low",
          confidence: 95,
          treatment: {
            organic: "Continue regular care",
            chemical: "No treatment needed",
          },
          description: "Healthy corn plant with no diseases detected",
        },
        {
          id: "4",
          date: "2025-01-08T16:20:00Z",
          image: "/tomato-plant-with-blight.jpg",
          crop: "Tomato",
          disease: "Early Blight",
          severity: "Medium",
          confidence: 84,
          treatment: {
            organic: "Apply copper-based organic fungicide",
            chemical: "Use chlorothalonil fungicide",
          },
          description: "Early blight symptoms on tomato leaves",
        },
      ]
      setRecords(mockData)
      setFilteredRecords(mockData)
      localStorage.setItem("agrisense-history", JSON.stringify(mockData))
    }
  }, [])

  useEffect(() => {
    let filtered = records

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.disease.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by severity
    if (severityFilter !== "all") {
      filtered = filtered.filter((record) => record.severity.toLowerCase() === severityFilter)
    }

    setFilteredRecords(filtered)
  }, [records, searchTerm, severityFilter])

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "High":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "Medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Low":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
        <Navigation />

        <main className="md:ml-64 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t("nav.history")}</h1>
              <p className="text-muted-foreground">View and manage your crop disease detection history</p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by crop or disease..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger>
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Records Grid */}
            {filteredRecords.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecords.map((record) => (
                  <Card key={record.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="aspect-square relative bg-muted rounded-lg overflow-hidden mb-3">
                        <Image
                          src={record.image || "/placeholder.svg"}
                          alt={`${record.crop} - ${record.disease}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{record.crop}</CardTitle>
                        {getSeverityIcon(record.severity)}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(record.date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Disease</p>
                          <p className="font-medium">{record.disease}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Severity</p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(record.severity)}`}
                            >
                              {record.severity}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Confidence</p>
                            <p className="font-medium">{record.confidence}%</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || severityFilter !== "all"
                      ? "No records match your current filters"
                      : "You haven't analyzed any crops yet"}
                  </p>
                  <Button onClick={() => (window.location.href = "/detect")}>
                    <Leaf className="h-4 w-4 mr-2" />
                    Start Detection
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Detail Modal */}
            {selectedRecord && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="h-5 w-5" />
                        {selectedRecord.crop} - {selectedRecord.disease}
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(null)}>
                        ×
                      </Button>
                    </div>
                    <CardDescription>{formatDate(selectedRecord.date)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Image */}
                    <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={selectedRecord.image || "/placeholder.svg"}
                        alt={`${selectedRecord.crop} - ${selectedRecord.disease}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Crop Type</p>
                        <p className="font-semibold">{selectedRecord.crop}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="font-semibold">{selectedRecord.confidence}%</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Disease</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-semibold">{selectedRecord.disease}</p>
                        {getSeverityIcon(selectedRecord.severity)}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Severity Level</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getSeverityColor(selectedRecord.severity)}`}
                      >
                        {selectedRecord.severity}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm mt-1 leading-relaxed">{selectedRecord.description}</p>
                    </div>

                    {/* Treatment Options */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Treatment Recommendations</p>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <p className="font-medium text-green-800 dark:text-green-200 mb-1">Organic Treatment</p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {selectedRecord.treatment.organic}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Chemical Treatment</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            {selectedRecord.treatment.chemical}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
