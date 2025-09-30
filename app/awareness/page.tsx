"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/components/language-provider"
import { Navigation } from "@/components/navigation"
import {
  BookOpen,
  AlertTriangle,
  Droplets,
  Thermometer,
  Calendar,
  Shield,
  Bug,
  FileText,
  ExternalLink,
} from "lucide-react"

export default function AwarenessPage() {
  const { t } = useLanguage()

  const guidelines = [
    {
      title: "Crop Disease Prevention",
      icon: Shield,
      content: [
        "Use certified disease-free seeds from Punjab Agricultural University (PAU)",
        "Maintain proper field sanitation and crop rotation",
        "Apply recommended fungicides at appropriate growth stages",
        "Monitor weather conditions for disease-favorable environments",
      ],
      severity: "high",
    },
    {
      title: "Integrated Pest Management (IPM)",
      icon: Bug,
      content: [
        "Use biological control agents like Trichogramma cards",
        "Install pheromone traps for early pest detection",
        "Apply neem-based organic pesticides when possible",
        "Follow Punjab government's pesticide resistance management guidelines",
      ],
      severity: "medium",
    },
    {
      title: "Water Management",
      icon: Droplets,
      content: [
        "Follow PAU's water scheduling recommendations for different crops",
        "Use drip irrigation to conserve water and reduce disease spread",
        "Avoid over-irrigation which promotes fungal diseases",
        "Monitor soil moisture using tensiometers or digital meters",
      ],
      severity: "high",
    },
    {
      title: "Seasonal Guidelines",
      icon: Calendar,
      content: [
        "Kharif Season: Focus on rice blast and bacterial blight prevention",
        "Rabi Season: Monitor for wheat rust and aphid infestations",
        "Summer: Prepare fields and manage cotton bollworm",
        "Follow PAU's crop calendar for optimal sowing and harvesting",
      ],
      severity: "medium",
    },
  ]

  const researchUpdates = [
    {
      title: "New Disease-Resistant Varieties",
      source: "Punjab Agricultural University",
      date: "2025",
      description:
        "PAU has released new wheat varieties resistant to yellow rust and rice varieties resistant to bacterial blight.",
    },
    {
      title: "Climate-Smart Agriculture",
      source: "ICAR-CSSRI Karnal",
      date: "2025",
      description:
        "Latest research on drought-tolerant crops and water-efficient farming practices for Punjab conditions.",
    },
    {
      title: "Organic Farming Guidelines",
      source: "Punjab State Farmers Commission",
      date: "2025",
      description: "Updated protocols for organic certification and sustainable farming practices in Punjab.",
    },
  ]

  const emergencyContacts = [
    { name: "PAU Helpline", number: "0161-2401960", service: "Crop Advisory" },
    { name: "Kisan Call Centre", number: "1800-180-1551", service: "24/7 Support" },
    { name: "Punjab Agriculture Dept", number: "0172-2970605", service: "Policy & Schemes" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      <Navigation />

      {/* Main Content */}
      <main className="md:ml-64 p-3 sm:p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold text-primary text-balance">Agricultural Guidelines</h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto text-pretty">
              Latest guidelines and recommendations from Punjab Agricultural University and research institutes
            </p>
          </div>

          {/* Guidelines Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {guidelines.map((guideline, index) => {
              const Icon = guideline.icon
              return (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        <CardTitle className="text-base sm:text-lg text-balance">{guideline.title}</CardTitle>
                      </div>
                      <Badge variant={guideline.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                        {guideline.severity === "high" ? "Critical" : "Important"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {guideline.content.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-pretty">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Research Updates */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <CardTitle className="text-base sm:text-lg">Latest Research Updates</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {researchUpdates.map((update, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground text-balance">
                        {update.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-pretty">{update.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                        <span className="text-xs text-primary font-medium">{update.source}</span>
                        <span className="text-xs text-muted-foreground">{update.date}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                  {index < researchUpdates.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <CardTitle className="text-base sm:text-lg">Emergency Contacts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="text-center p-3 sm:p-4 bg-accent rounded-lg">
                    <h3 className="font-semibold text-sm sm:text-base text-foreground text-balance">{contact.name}</h3>
                    <p className="text-base sm:text-lg font-mono text-primary mt-1">{contact.number}</p>
                    <p className="text-xs text-muted-foreground mt-1">{contact.service}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Alert */}
          <Card className="shadow-lg border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                <CardTitle className="text-orange-800 dark:text-orange-200 text-base sm:text-lg">
                  Weather Advisory
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 dark:text-orange-300 text-sm sm:text-base text-pretty">
                <strong>Current Season Alert:</strong> Monitor crops for late blight and downy mildew due to high
                humidity. Apply preventive fungicides as recommended by PAU. Check weather forecasts regularly and avoid
                irrigation during rainy periods.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
