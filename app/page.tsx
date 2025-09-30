"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { Leaf, Brain, Stethoscope, FileText, ArrowRight, Smartphone } from "lucide-react"

export default function LandingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20">
      <Navigation />

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo and Title */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-6">
              <Leaf className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-primary" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary text-balance">
                {t("landing.title")}
              </h1>
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-4 text-balance">
              {t("landing.subtitle")}
            </h2>

            <p className="text-base sm:text-lg text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed text-pretty">
              {t("landing.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/detect">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 gap-2 bg-primary hover:bg-primary/90"
                >
                  <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />
                  Start Scan
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>

              <Link href="/govt-login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 gap-2 bg-transparent"
                >
                  <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
                  Govt Official Login
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 max-w-3xl mx-auto px-4 sm:px-0">
            <div className="aspect-video bg-gradient-to-r from-primary/20 to-secondary/30 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden">
              <img
                src="/farmer-using-smartphone-to-scan-crop-leaves-with-a.jpg"
                alt="Farmer using AgriSense app"
                className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-foreground text-balance">
              Key Features
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 sm:pt-6">
                  <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                  <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground text-balance">
                    {t("landing.features.ai")}
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
                    Advanced AI technology to accurately identify crop diseases from photos
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-4 sm:pt-6">
                  <Stethoscope className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                  <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground text-balance">
                    {t("landing.features.treatment")}
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
                    Get personalized treatment recommendations for detected diseases
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                <CardContent className="pt-4 sm:pt-6">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                  <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground text-balance">
                    {t("landing.features.history")}
                  </h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
                    Track your crop health history and monitor treatment progress
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center text-muted-foreground">
          <p className="text-sm sm:text-base">&copy; 2025 AgriSense. Empowering farmers with AI technology.</p>
        </footer>
      </main>
    </div>
  )
}
