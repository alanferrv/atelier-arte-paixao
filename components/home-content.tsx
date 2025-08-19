"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Sparkles,
  TrendingUp,
  Calendar,
  Users,
  Calculator,
  ArrowRight,
  Star,
  Clock,
  Gift,
  Scissors,
  Palette,
  Crown,
  Baby,
  type LucideIcon,
} from "lucide-react"
import { getHomeData } from "@/app/actions" // Import the server action
import type { Order, QuickStat } from "@/types/db" // Import types

// Map string icon names to Lucide components
const LucideIcons: { [key: string]: LucideIcon } = {
  TrendingUp,
  Scissors,
  Heart,
  Calendar,
  Users,
  Calculator,
  Star,
  Clock,
  Gift,
  Palette,
  Crown,
  Baby,
  Sparkles,
  ArrowRight,
}

export function HomeContent() {
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [quickStats, setQuickStats] = useState<QuickStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getHomeData()
        setRecentOrders(data.recentOrders as Order[])
        setQuickStats(data.quickStats as QuickStat[])
      } catch (err) {
        console.error("Failed to fetch home data:", err)
        setError("Erro ao carregar dados do dashboard.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em produção":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Aguardando prova":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "Finalizado":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-emerald-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-warm-700">Carregando dados do ateliê...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full border border-amber-200 shadow-soft">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">Bem-vinda de volta!</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-warm-900">
            Olá,{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Sassá</span>!
            <span className="inline-block ml-2">✨</span>
          </h1>
          <p className="text-xl text-warm-700 max-w-3xl mx-auto">
            Seu ateliê está florescendo! Aqui está um resumo carinhoso do que está acontecendo hoje.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {quickStats.map((stat, index) => {
          const Icon = LucideIcons[stat.icon] || Sparkles // Fallback icon
          return (
            <Card
              key={index}
              className={`relative overflow-hidden border-0 shadow-warm hover:shadow-glow transition-all duration-500 hover:scale-105 bg-gradient-to-br ${stat.bgColor}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full -mr-16 -mt-16" />
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-warm-600">{stat.label}</p>
                    <p className="text-4xl font-bold text-warm-900">{stat.value}</p>
                    <div className="flex items-center space-x-1">
                      {Icon && <Icon className="w-4 h-4 text-emerald-600" />}
                      <p className="text-sm text-emerald-600 font-medium">{stat.change} este mês</p>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    {Icon && <Icon className="w-8 h-8 text-white" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-warm bg-gradient-to-br from-white to-amber-50/50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <Gift className="w-6 h-6 text-amber-600" />
            <span>Ações Rápidas</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Acesse rapidamente as funcionalidades mais utilizadas do seu ateliê
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Button className="h-24 bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-warm hover:scale-105 transition-all duration-300 rounded-2xl">
              <div className="flex flex-col items-center space-y-3">
                <Calculator className="w-8 h-8" />
                <span className="font-medium">Novo Orçamento</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 border-2 border-rose-200 hover:bg-rose-50 bg-white/70 hover:scale-105 transition-all duration-300 rounded-2xl"
            >
              <div className="flex flex-col items-center space-y-3">
                <Users className="w-8 h-8 text-rose-600" />
                <span className="font-medium text-rose-700">Nova Cliente</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 border-2 border-blue-200 hover:bg-blue-50 bg-white/70 hover:scale-105 transition-all duration-300 rounded-2xl"
            >
              <div className="flex flex-col items-center space-y-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <span className="font-medium text-blue-700">Agendar Prova</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-24 border-2 border-emerald-200 hover:bg-emerald-50 bg-white/70 hover:scale-105 transition-all duration-300 rounded-2xl"
            >
              <div className="flex flex-col items-center space-y-3">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
                <span className="font-medium text-emerald-700">Ver Relatórios</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-0 shadow-warm bg-gradient-to-br from-white to-rose-50/30">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <Scissors className="w-6 h-6 text-amber-600" />
                  <span>Pedidos Recentes</span>
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Acompanhe o progresso dos seus trabalhos com carinho
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-50 rounded-xl">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-6 bg-white/80 rounded-2xl border border-amber-100 hover:shadow-soft transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-5">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
                        {order.age_category?.includes("meses") ? (
                          <Baby className="w-8 h-8 text-amber-600" />
                        ) : (
                          <Crown className="w-8 h-8 text-amber-600" />
                        )}
                      </div>
                      <div
                        className={`absolute -top-2 -right-2 w-5 h-5 rounded-full ${getPriorityColor(order.priority)}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-warm-900 text-lg">{order.client_name}</h4>
                      <p className="text-warm-700 font-medium">{order.product_name}</p>
                      <div className="flex items-center space-x-4 text-sm text-warm-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Entrega: {new Date(order.due_date).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Baby className="w-4 h-4" />
                          <span>{order.age_category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-3">
                    <p className="font-bold text-emerald-600 text-xl">
                      R$ {Number.parseFloat(order.value.toString()).toFixed(2).replace(".", ",")}
                    </p>
                    <Badge variant="outline" className={`${getStatusColor(order.status)} font-medium`}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">Nenhum pedido recente encontrado.</p>
            )}
          </CardContent>
        </Card>

        {/* Today's Schedule & Tips */}
        <div className="space-y-8">
          <Card className="border-0 shadow-warm bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span>Agenda de Hoje</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-blue-900">Prova - Maria Santos</p>
                    <p className="text-sm text-blue-700">14:00 • Vestido Princesa</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Hoje</Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-bold text-amber-900">Entrega - Ana Costa</p>
                    <p className="text-sm text-amber-700">16:30 • Conjunto Batizado</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">Hoje</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-warm bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <Star className="w-6 h-6 text-amber-600" />
                <span>Dica do Dia</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Palette className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-2">Organize suas medidas</p>
                    <p className="text-sm text-warm-700 leading-relaxed">
                      Mantenha um caderno específico para as medidas de cada cliente. Isso agiliza o processo e evita
                      erros!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-warm bg-gradient-to-br from-rose-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <Heart className="w-6 h-6 text-rose-600" />
                <span>Meta Mensal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-warm-700">R$ 8.450 de R$ 12.000</span>
                  <span className="text-rose-600">70%</span>
                </div>
                <div className="w-full bg-rose-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-rose-400 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-warm-600">
                Faltam <span className="font-semibold text-rose-600">R$ 3.550</span> para atingir sua meta mensal! 💪
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
