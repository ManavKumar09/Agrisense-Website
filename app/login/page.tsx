"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { useRouter } from "next/navigation"
import { Leaf, Phone, Shield, ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [name, setName] = useState("") // Added name state for profile
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phoneNumber || phoneNumber.length < 10) return // Added name validation

    setLoading(true)
    try {
      // TODO: Integrate with Firebase Phone Auth
      // const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      // setConfirmationResult(confirmation)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStep("otp")
    } catch (error) {
      console.error("Error sending OTP:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length < 6) return

    setLoading(true)
    try {
      // TODO: Integrate with Firebase Phone Auth
      // const result = await confirmationResult.confirm(otp)
      // const user = result.user

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      login(phoneNumber, name) // Pass name to login function

      router.push("/dashboard")
    } catch (error) {
      console.error("Error verifying OTP:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>{t("common.back")}</span>
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">{t("landing.title")}</span>
            </div>
            <CardTitle className="text-xl">{t("login.title")}</CardTitle>
            <CardDescription>
              {step === "phone" ? "Enter your details to receive OTP" : "Enter the 6-digit code sent to your phone"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === "phone" ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg py-6"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t("login.mobile")}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg py-6"
                    required
                  />
                </div>

                <Button type="submit" className="w-full py-6 text-lg" disabled={loading || !name || !phoneNumber}>
                  {loading ? t("common.loading") : t("login.send")}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t("login.otp")}
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="text-lg py-6 text-center tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm text-muted-foreground text-center">Code sent to {phoneNumber}</p>
                </div>

                <div className="space-y-3">
                  <Button type="submit" className="w-full py-6 text-lg" disabled={loading || otp.length < 6}>
                    {loading ? t("common.loading") : t("login.verify")}
                  </Button>

                  <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("phone")}>
                    Change Phone Number
                  </Button>
                </div>
              </form>
            )}

            {/* Firebase Recaptcha Container */}
            <div id="recaptcha-container" className="mt-4"></div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Secure login powered by Firebase Authentication</p>
        </div>
      </div>
    </div>
  )
}
