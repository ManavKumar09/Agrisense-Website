"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "next-themes"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/hooks/use-auth"
import { Settings, Moon, Sun, Globe, User, LogOut, Smartphone } from "lucide-react"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState(true)

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const languageOptions = [
    { value: "en", label: "English", nativeLabel: "English" },
    { value: "hi", label: "Hindi", nativeLabel: "हिंदी" },
    { value: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ" },
  ]

  const themeOptions = [
    { value: "light", label: t("settings.light"), icon: Sun },
    { value: "dark", label: t("settings.dark"), icon: Moon },
    { value: "system", label: t("settings.system"), icon: Smartphone },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
        <Navigation />

        <main className="md:ml-64 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{t("settings.title")}</h1>
              <p className="text-muted-foreground">Customize your AgriSense experience</p>
            </div>

            <div className="space-y-6">
              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>Your account details and login information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Name</p>
                      <p className="text-sm text-muted-foreground">{user?.name || "Not available"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Login Time</p>
                      <p className="text-sm font-medium">
                        {user?.loginTime ? new Date(user.loginTime).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appearance Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize the look and feel of the application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">{t("settings.theme")}</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {themeOptions.map((option) => {
                        const Icon = option.icon
                        const isSelected = theme === option.value

                        return (
                          <Button
                            key={option.value}
                            variant={isSelected ? "default" : "outline"}
                            className={`h-16 flex-col gap-2 ${isSelected ? "" : "bg-transparent"}`}
                            onClick={() => setTheme(option.value)}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-sm">{option.label}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Language Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Language
                  </CardTitle>
                  <CardDescription>Choose your preferred language for the interface</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">{t("settings.language")}</Label>
                    <Select value={language} onValueChange={(value: "en" | "hi" | "pa") => setLanguage(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-3">
                              <span>{option.label}</span>
                              <span className="text-muted-foreground">({option.nativeLabel})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Disease Detection Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when disease analysis is complete</p>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Treatment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive reminders for crop treatments</p>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Weather Updates</Label>
                      <p className="text-sm text-muted-foreground">Get weather alerts for your crops</p>
                    </div>
                    <Switch checked={false} onCheckedChange={() => {}} />
                  </div>
                </CardContent>
              </Card>

              {/* Data & Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                  <CardDescription>Manage your data and privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Data Storage</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your crop analysis data is stored locally and in Firebase for synchronization across devices.
                    </p>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Export My Data
                    </Button>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Privacy Policy</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn how we protect your data and respect your privacy.
                    </p>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      View Privacy Policy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>Manage your account and session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="destructive" className="w-full md:w-auto" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>

              {/* App Information */}
              <Card>
                <CardHeader>
                  <CardTitle>About AgriSense</CardTitle>
                  <CardDescription>Application information and support</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Version</p>
                      <p className="font-medium">1.0.0</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium">January 2025</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground text-center">
                      AgriSense - Empowering farmers with AI technology
                    </p>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      © 2025 AgriSense. All rights reserved.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
