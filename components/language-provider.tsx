"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "hi" | "pa"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.detect": "Detect Disease",
    "nav.history": "Crop History",
    "nav.awareness": "Guidelines",
    "nav.settings": "Settings",

    // Landing Page
    "landing.title": "AgriSense",
    "landing.subtitle": "Smart Crop Disease Detection",
    "landing.description": "AI-powered platform to help farmers detect and treat crop diseases effectively",
    "landing.login": "Login with Mobile Number",
    "landing.features.ai": "AI Disease Detection",
    "landing.features.treatment": "Treatment Recommendations",
    "landing.features.history": "Crop Health Records",

    // Login
    "login.title": "Login to AgriSense",
    "login.mobile": "Mobile Number",
    "login.otp": "Enter OTP",
    "login.send": "Send OTP",
    "login.verify": "Verify OTP",

    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.detect": "Detect Crop Disease",
    "dashboard.history": "My Crop History",
    "dashboard.settings": "Settings",

    // Disease Detection
    "detect.title": "Crop Disease Detection",
    "detect.upload": "Upload Image",
    "detect.camera": "Take Photo",
    "detect.analyze": "Analyze Crop",
    "detect.spray": "Spray Pesticide",
    "detect.results.crop": "Crop Type",
    "detect.results.disease": "Detected Disease",
    "detect.results.severity": "Severity Level",
    "detect.results.treatment": "Treatment",

    // Settings
    "settings.title": "Settings",
    "settings.theme": "Theme",
    "settings.language": "Language",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "settings.system": "System",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error occurred",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.back": "Back",
  },
  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.dashboard": "डैशबोर्ड",
    "nav.detect": "रोग पहचान",
    "nav.history": "फसल इतिहास",
    "nav.awareness": "दिशानिर्देश",
    "nav.settings": "सेटिंग्स",

    // Landing Page
    "landing.title": "एग्रीसेंस",
    "landing.subtitle": "स्मार्ट फसल रोग पहचान",
    "landing.description": "किसानों की मदद के लिए AI-संचालित प्लेटफॉर्म जो फसल के रोगों को प्रभावी रूप से पहचानता और उपचार करता है",
    "landing.login": "मोबाइल नंबर से लॉगिन करें",
    "landing.features.ai": "AI रोग पहचान",
    "landing.features.treatment": "उपचार सुझाव",
    "landing.features.history": "फसल स्वास्थ्य रिकॉर्ड",

    // Login
    "login.title": "एग्रीसेंस में लॉगिन करें",
    "login.mobile": "मोबाइल नंबर",
    "login.otp": "OTP दर्ज करें",
    "login.send": "OTP भेजें",
    "login.verify": "OTP सत्यापित करें",

    // Dashboard
    "dashboard.welcome": "स्वागत",
    "dashboard.detect": "फसल रोग पहचान",
    "dashboard.history": "मेरा फसल इतिहास",
    "dashboard.settings": "सेटिंग्स",

    // Disease Detection
    "detect.title": "फसल रोग पहचान",
    "detect.upload": "छवि अपलोड करें",
    "detect.camera": "फोटो लें",
    "detect.analyze": "फसल का विश्लेषण करें",
    "detect.spray": "कीटनाशक छिड़काव",
    "detect.results.crop": "फसल का प्रकार",
    "detect.results.disease": "पहचाना गया रोग",
    "detect.results.severity": "गंभीरता स्तर",
    "detect.results.treatment": "उपचार",

    // Settings
    "settings.title": "सेटिंग्स",
    "settings.theme": "थीम",
    "settings.language": "भाषा",
    "settings.light": "हल्का",
    "settings.dark": "गहरा",
    "settings.system": "सिस्टम",

    // Common
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि हुई",
    "common.success": "सफलता",
    "common.cancel": "रद्द करें",
    "common.save": "सेव करें",
    "common.back": "वापस",
  },
  pa: {
    // Navigation
    "nav.home": "ਘਰ",
    "nav.dashboard": "ਡੈਸ਼ਬੋਰਡ",
    "nav.detect": "ਬਿਮਾਰੀ ਪਛਾਣ",
    "nav.history": "ਫਸਲ ਇਤਿਹਾਸ",
    "nav.awareness": "ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼",
    "nav.settings": "ਸੈਟਿੰਗਾਂ",

    // Landing Page
    "landing.title": "ਐਗਰੀਸੈਂਸ",
    "landing.subtitle": "ਸਮਾਰਟ ਫਸਲ ਬਿਮਾਰੀ ਪਛਾਣ",
    "landing.description":
      "ਕਿਸਾਨਾਂ ਦੀ ਮਦਦ ਲਈ AI-ਸੰਚਾਲਿਤ ਪਲੇਟਫਾਰਮ ਜੋ ਫਸਲਾਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਨੂੰ ਪ੍ਰਭਾਵਸ਼ਾਲੀ ਢੰਗ ਨਾਲ ਪਛਾਣਦਾ ਅਤੇ ਇਲਾਜ ਕਰਦਾ ਹੈ",
    "landing.login": "ਮੋਬਾਈਲ ਨੰਬਰ ਨਾਲ ਲਾਗਇਨ ਕਰੋ",
    "landing.features.ai": "AI ਬਿਮਾਰੀ ਪਛਾਣ",
    "landing.features.treatment": "ਇਲਾਜ ਸੁਝਾਅ",
    "landing.features.history": "ਫਸਲ ਸਿਹਤ ਰਿਕਾਰਡ",

    // Login
    "login.title": "ਐਗਰੀਸੈਂਸ ਵਿੱਚ ਲਾਗਇਨ ਕਰੋ",
    "login.mobile": "ਮੋਬਾਈਲ ਨੰਬਰ",
    "login.otp": "OTP ਦਾਖਲ ਕਰੋ",
    "login.send": "OTP ਭੇਜੋ",
    "login.verify": "OTP ਤਸਦੀਕ ਕਰੋ",

    // Dashboard
    "dashboard.welcome": "ਸਵਾਗਤ",
    "dashboard.detect": "ਫਸਲ ਬਿਮਾਰੀ ਪਛਾਣ",
    "dashboard.history": "ਮੇਰਾ ਫਸਲ ਇਤਿਹਾਸ",
    "dashboard.settings": "ਸੈਟਿੰਗਾਂ",

    // Disease Detection
    "detect.title": "ਫਸਲ ਬਿਮਾਰੀ ਪਛਾਣ",
    "detect.upload": "ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ",
    "detect.camera": "ਫੋਟੋ ਲਓ",
    "detect.analyze": "ਫਸਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
    "detect.spray": "ਕੀਟਨਾਸ਼ਕ ਛਿੜਕਾਅ",
    "detect.results.crop": "ਫਸਲ ਦੀ ਕਿਸਮ",
    "detect.results.disease": "ਪਛਾਣੀ ਗਈ ਬਿਮਾਰੀ",
    "detect.results.severity": "ਗੰਭੀਰਤਾ ਪੱਧਰ",
    "detect.results.treatment": "ਇਲਾਜ",

    // Settings
    "settings.title": "ਸੈਟਿੰਗਾਂ",
    "settings.theme": "ਥੀਮ",
    "settings.language": "ਭਾਸ਼ਾ",
    "settings.light": "ਹਲਕਾ",
    "settings.dark": "ਗੂੜ੍ਹਾ",
    "settings.system": "ਸਿਸਟਮ",

    // Common
    "common.loading": "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    "common.error": "ਗਲਤੀ ਹੋਈ",
    "common.success": "ਸਫਲਤਾ",
    "common.cancel": "ਰੱਦ ਕਰੋ",
    "common.save": "ਸੇਵ ਕਰੋ",
    "common.back": "ਵਾਪਸ",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("agrisense-language") as Language
    if (savedLanguage && ["en", "hi", "pa"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("agrisense-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
