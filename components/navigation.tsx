"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/hooks/use-auth"
import { Home, LayoutDashboard, Search, History, Settings, Menu, Leaf, LogOut, BookOpen } from "lucide-react"

const navigationItems = [
  { key: "nav.home", href: "/", icon: Home },
  { key: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "nav.detect", href: "/detect", icon: Search },
  { key: "nav.history", href: "/history", icon: History },
  { key: "nav.awareness", href: "/awareness", icon: BookOpen },
  { key: "nav.settings", href: "/settings", icon: Settings },
]

export function Navigation() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsOpen(false)
  }

  const NavItems = () => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        // Hide dashboard and other protected routes if not logged in
        if (!user && ["/dashboard", "/detect", "/history", "/settings"].includes(item.href)) {
          return null
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
            onClick={() => setIsOpen(false)}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{t(item.key)}</span>
          </Link>
        )
      })}

      {/* Logout Button for authenticated users */}
      {user && (
        <Button
          variant="ghost"
          className="flex items-center gap-3 px-4 py-3 rounded-lg justify-start text-muted-foreground hover:text-foreground hover:bg-accent w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Button>
      )}
    </>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <div className="flex items-center gap-2">
                  <Leaf className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-primary">{t("landing.title")}</span>
                </div>
                {user && <p className="text-sm text-muted-foreground mt-2">{user.name || "Farmer"}</p>}
              </div>
              <nav className="flex-1 p-4 space-y-2">
                <NavItems />
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">{t("landing.title")}</span>
          </div>
          {user && <p className="text-sm text-muted-foreground mt-2">{user.name || "Farmer"}</p>}
        </div>
        <div className="flex-1 p-4 space-y-2">
          <NavItems />
        </div>
      </nav>
    </>
  )
}
