"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  phone: string
  loginTime: string
  name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phone: string, name?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("agrisense-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("agrisense-user")
      }
    }
    setLoading(false)
  }, [])

  const login = (phone: string, name?: string) => {
    const userData = {
      phone,
      loginTime: new Date().toISOString(),
      name: name || undefined,
    }
    setUser(userData)
    localStorage.setItem("agrisense-user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("agrisense-user")
    localStorage.removeItem("agrisense-history") // Clear history on logout
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
