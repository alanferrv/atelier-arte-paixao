"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Heart,
  Search,
  Bell,
  Menu,
  X,
  Calculator,
  Users,
  BarChart3,
  Settings,
  Package,
  Calendar,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { UserButton } from "@/components/user-button" // Import UserButton
import type { User as SupabaseUser } from "@supabase/supabase-js" // Import Supabase User type

interface ModernLayoutProps {
  children: React.ReactNode
  user: SupabaseUser | null // Pass user prop
}

export function ModernLayout({ children, user }: ModernLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const navigation = [
    { id: "home", label: "Início", icon: Heart },
    { id: "quotes", label: "Orçamentos", icon: Calculator },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "products", label: "Produtos", icon: Package },
    { id: "calendar", label: "Agenda", icon: Calendar },
    { id: "reports", label: "Relatórios", icon: BarChart3 },
    { id: "settings", label: "Configurações", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-warm-gradient relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-rose-200/30 to-transparent rounded-full blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-amber-200/50 shadow-md opacity-75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center h-full">
            <img src="/images/atelie-logo.png" alt="Ateliê Arte & Paixão Baby" className="h-14 w-auto object-contain" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 h-full">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex items-center px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 space-x-2",
                    activeSection === item.id
                      ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 shadow-soft border border-amber-200"
                      : "text-warm-700 hover:text-amber-700 hover:bg-white/50",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4 h-full">
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
              <Input
                type="search"
                placeholder="Buscar clientes, pedidos..."
                className="pl-12 w-72 h-12 bg-white/70 border-amber-200 focus:border-amber-400 focus:ring-amber-200 rounded-2xl shadow-soft"
              />
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-12 w-12 rounded-2xl hover:bg-white/50 hover:scale-105 transition-all duration-300"
            >
              <Bell className="w-6 h-6 text-amber-700" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </Button>

            {/* Profile/User Button */}
            <UserButton user={user} />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-12 w-12 rounded-2xl hover:bg-white/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-200/50 glass">
            <div className="px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={cn(
                      "flex items-center space-x-4 w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300",
                      activeSection === item.id
                        ? "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 shadow-soft"
                        : "text-warm-700 hover:text-amber-700 hover:bg-white/50",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">{children}</main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          size="lg"
          className="h-16 w-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-warm hover:scale-110 transition-all duration-300"
        >
          <Sparkles className="w-8 h-8" />
        </Button>
      </div>
    </div>
  )
}
