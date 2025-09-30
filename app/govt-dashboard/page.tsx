"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  Shield,
  Activity,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  CheckCircle,
  BarChart3,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for Punjab farmers
const scanActivityData = [
  { date: "2025-01-01", scans: 45, farmers: 23, location: "Ludhiana" },
  { date: "2025-01-02", scans: 67, farmers: 34, location: "Amritsar" },
  { date: "2025-01-03", scans: 89, farmers: 45, location: "Jalandhar" },
  { date: "2025-01-04", scans: 123, farmers: 67, location: "Patiala" },
  { date: "2025-01-05", scans: 156, farmers: 78, location: "Bathinda" },
  { date: "2025-01-06", scans: 134, farmers: 89, location: "Mohali" },
  { date: "2025-01-07", scans: 178, farmers: 95, location: "Ferozepur" },
]

const diseaseData = [
  { month: "Jan", leafBlight: 23, powderyMildew: 15, rustDisease: 8, aphids: 12 },
  { month: "Feb", leafBlight: 34, powderyMildew: 22, rustDisease: 12, aphids: 18 },
  { month: "Mar", leafBlight: 45, powderyMildew: 28, rustDisease: 15, aphids: 25 },
  { month: "Apr", leafBlight: 67, powderyMildew: 35, rustDisease: 22, aphids: 32 },
  { month: "May", leafBlight: 89, powderyMildew: 45, rustDisease: 28, aphids: 38 },
  { month: "Jun", leafBlight: 78, powderyMildew: 52, rustDisease: 35, aphids: 45 },
]

const pesticideSavingsData = [
  { name: "Traditional Farming", value: 2500, color: "#ef4444" },
  { name: "AI-Guided Treatment", value: 1200, color: "#22c55e" },
  { name: "Savings", value: 1300, color: "#3b82f6" },
]

const recentScans = [
  {
    id: 1,
    farmer: "Rajesh Kumar",
    location: "Ludhiana",
    disease: "Leaf Blight",
    severity: "Medium",
    time: "2 hours ago",
    status: "treated",
  },
  {
    id: 2,
    farmer: "Preet Singh",
    location: "Amritsar",
    disease: "Powdery Mildew",
    severity: "High",
    time: "4 hours ago",
    status: "pending",
  },
  {
    id: 3,
    farmer: "Harjeet Kaur",
    location: "Jalandhar",
    disease: "Rust Disease",
    severity: "Low",
    time: "6 hours ago",
    status: "treated",
  },
  {
    id: 4,
    farmer: "Manpreet Singh",
    location: "Patiala",
    disease: "Aphid Infestation",
    severity: "Medium",
    time: "8 hours ago",
    status: "monitoring",
  },
  {
    id: 5,
    farmer: "Simran Kaur",
    location: "Bathinda",
    disease: "Leaf Spot",
    severity: "High",
    time: "10 hours ago",
    status: "treated",
  },
]

export default function GovtDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "treated":
        return "default"
      case "pending":
        return "destructive"
      case "monitoring":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">AgriSense</h1>
                <p className="text-sm text-muted-foreground">Government Monitoring Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Punjab Agricultural Department</span>
              </div>
              <Link href="/govt-login">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans Today</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">567</div>
              <p className="text-xs text-muted-foreground">+8% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pesticide Saved</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1.3L</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Districts Covered</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22/22</div>
              <p className="text-xs text-muted-foreground">All Punjab districts</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Scan Activity</TabsTrigger>
            <TabsTrigger value="trends">Disease Trends</TabsTrigger>
            <TabsTrigger value="savings">Pesticide Savings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Scan Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Scan Activity
                  </CardTitle>
                  <CardDescription>Latest farmer scans across Punjab</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentScans.slice(0, 5).map((scan) => (
                      <div key={scan.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{scan.farmer}</span>
                            <Badge variant="outline" className="text-xs">
                              {scan.location}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{scan.disease}</span>
                            <Badge variant={getSeverityColor(scan.severity)} className="text-xs">
                              {scan.severity}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(scan.status)} className="mb-1">
                            {scan.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{scan.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Weekly Summary
                  </CardTitle>
                  <CardDescription>Punjab agricultural monitoring stats</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={scanActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="scans" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="farmers" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Farmer Scan Activity Logs</CardTitle>
                <CardDescription>Detailed view of all scanning activities across Punjab</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentScans.map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{scan.farmer}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{scan.location}</span>
                            <Calendar className="h-3 w-3 ml-2" />
                            <span>{scan.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{scan.disease}</span>
                          <Badge variant={getSeverityColor(scan.severity)}>{scan.severity}</Badge>
                        </div>
                        <Badge variant={getStatusColor(scan.status)}>{scan.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Disease Trends in Punjab</CardTitle>
                <CardDescription>Monthly disease detection patterns across the state</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={diseaseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="leafBlight" fill="#ef4444" name="Leaf Blight" />
                    <Bar dataKey="powderyMildew" fill="#f97316" name="Powdery Mildew" />
                    <Bar dataKey="rustDisease" fill="#eab308" name="Rust Disease" />
                    <Bar dataKey="aphids" fill="#22c55e" name="Aphids" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="savings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pesticide Cost Comparison</CardTitle>
                  <CardDescription>Traditional vs AI-guided treatment costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pesticideSavingsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ₹${value}`}
                      >
                        {pesticideSavingsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Savings Impact</CardTitle>
                  <CardDescription>Environmental and economic benefits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-400">₹1,30,000 Saved</h4>
                      <p className="text-sm text-green-600 dark:text-green-500">52% reduction in pesticide costs</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Leaf className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-400">2,500 kg Reduced</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-500">Less chemical pesticide usage</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <div>
                      <h4 className="font-semibold text-orange-800 dark:text-orange-400">15% Yield Increase</h4>
                      <p className="text-sm text-orange-600 dark:text-orange-500">Better crop health management</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
