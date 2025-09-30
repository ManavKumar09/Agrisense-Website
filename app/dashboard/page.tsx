"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/hooks/use-auth"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { Search, History, Settings, Leaf, TrendingUp, Camera, FileText, Sun, Droplets } from "lucide-react"

interface CropRecord {
  id: string
  date: string
  crop: string
  disease: string
  severity: "Low" | "Medium" | "High"
  treated: boolean
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [recentRecords, setRecentRecords] = useState<CropRecord[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    // Load recent crop records (placeholder data)
    setRecentRecords([
      {
        id: "1",
        date: "2025-01-15",
        crop: "Wheat",
        disease: "Leaf Rust",
        severity: "Medium",
        treated: true,
      },
      {
        id: "2",
        date: "2025-01-12",
        crop: "Rice",
        disease: "Blast Disease",
        severity: "Low",
        treated: true,
      },
      {
        id: "3",
        date: "2025-01-10",
        crop: "Corn",
        disease: "Healthy",
        severity: "Low",
        treated: false,
      },
    ])
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      <Navigation />

      {/* Main Content */}
      <main className="md:ml-64 p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
            {t("dashboard.welcome")}, {user?.name || "Farmer"}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground text-pretty">
            Monitor your crops and detect diseases with AI-powered analysis
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link href="/detect">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="p-4 sm:p-6 text-center">
                <Camera className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-balance">{t("dashboard.detect")}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-pretty">
                  Take a photo to analyze crop health
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
              <CardContent className="p-4 sm:p-6 text-center">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-balance">{t("dashboard.history")}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-pretty">View your crop health records</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50 sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <Settings className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-balance">{t("dashboard.settings")}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-pretty">Customize your preferences</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-foreground">12</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Healthy Crops</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-foreground">25</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Scans Done</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <Sun className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-foreground">28°C</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Temperature</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4 text-center">
              <Droplets className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-foreground">65%</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Humidity</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <History className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Crop Analysis
            </CardTitle>
            <CardDescription className="text-sm">Your latest crop health assessments</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRecords.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {recentRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base text-foreground">{record.crop}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm sm:text-base text-foreground">{record.disease}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(record.severity)}`}
                      >
                        {record.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <Search className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground">No crop analysis yet</p>
                <Link href="/detect">
                  <Button className="mt-4">Start First Analysis</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
