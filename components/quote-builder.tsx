"use client"

import type React from "react"

import { useState, useActionState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Calculator, Save, Send, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createQuote } from "@/app/actions" // Import the server action

interface QuoteItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export function QuoteBuilder() {
  const [ageCategory, setAgeCategory] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [items, setItems] = useState<QuoteItem[]>([])
  const [customItems, setCustomItems] = useState<QuoteItem[]>([]) // This state is not used, can be removed if not needed
  const [formState, formAction] = useActionState(createQuote, { success: false, message: "" })

  const ageCategories = [
    { value: "0-11m", label: "0 a 11 meses", basePrice: 150 },
    { value: "1-4a", label: "1 a 4 anos", basePrice: 200 },
    { value: "5-10a", label: "5 a 10 anos", basePrice: 250 },
  ]

  const additionalServices = [
    { name: "Aplicação Flores Pétalas", price: 2.5 },
    { name: "Aplicação Raminhos", price: 2.5 },
    { name: "Aplicação Borboletas", price: 1.5 },
    { name: "Aplicação Flores Delicadas", price: 3.0 },
    { name: "Aplicação Folhas", price: 1.5 },
    { name: "Bordado Máquina", price: 20.0 },
    { name: "Bordado Mão", price: 10.0 },
    { name: "Bordado com Pedraria", price: 30.0 },
    { name: "Cinto Pedraria/Pérola", price: 20.0 },
    { name: "Cinto Fita Veludo", price: 20.0 },
    { name: "Cinto Tubo Silicone Brilhoso", price: 20.0 },
    { name: "Botão Forrado", price: 1.2 },
    { name: "Laços Cetim Lycra 35x45", price: 1.2 },
    { name: "Crinol", price: 4.0 },
  ]

  const fabricServices = [
    { name: "Sublimação", price: 20.0 },
    { name: "Tule Noiva", price: 22.0 },
    { name: "Zibeline", price: 30.0 },
    { name: "Cetim Eucol", price: 30.0 },
    { name: "Tricoline", price: 30.0 },
    { name: "Tule Cristal", price: 15.0 },
    { name: "Tule Ilusão", price: 19.0 },
    { name: "Crepe Amanda", price: 30.0 },
    { name: "Linho", price: 50.0 },
    { name: "Organza Cristal", price: 25.0 },
  ]

  const addItem = (service: { name: string; price: number }, type: "additional" | "fabric") => {
    const newItem: QuoteItem = {
      id: `${type}-${Date.now()}`,
      name: service.name,
      quantity: 1,
      unitPrice: service.price,
      total: service.price,
    }
    setItems([...items, newItem])
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, quantity, total: quantity * item.unitPrice } : item)))
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const getBasePrice = () => {
    const category = ageCategories.find((cat) => cat.value === ageCategory)
    return category ? category.basePrice : 0
  }

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0) + getBasePrice()
  }

  const getTotal = () => {
    return getSubtotal() // Pode adicionar descontos ou taxas aqui
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append("items", JSON.stringify(items))
    formData.append("totalValue", getTotal().toFixed(2))
    await formAction(formData)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Novo Orçamento
            </h1>
            <p className="text-muted-foreground">Crie um orçamento detalhado para sua cliente</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            <Button variant="outline" type="submit" disabled={formState.success}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              type="submit"
              disabled={formState.success}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>

        {formState.message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${formState.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {formState.message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações da Cliente</CardTitle>
                <CardDescription>Dados básicos para o orçamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome da Cliente</Label>
                    <Input id="clientName" name="clientName" placeholder="Digite o nome completo" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Telefone</Label>
                    <Input id="clientPhone" name="clientPhone" placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">E-mail</Label>
                  <Input id="clientEmail" name="clientEmail" type="email" placeholder="cliente@email.com" required />
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria por Idade</Label>
                    <Select value={ageCategory} onValueChange={setAgeCategory} name="ageCategory" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a faixa etária" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label} - R$ {category.basePrice.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Serviço</Label>
                    <Select value={serviceType} onValueChange={setServiceType} name="serviceType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Venda ou Aluguel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venda">Venda</SelectItem>
                        <SelectItem value="aluguel">Aluguel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Produto</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva detalhes do vestido, cores, estilo, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionais e Acabamentos</CardTitle>
                <CardDescription>Selecione os serviços adicionais</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="additional" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="additional">Acabamentos</TabsTrigger>
                    <TabsTrigger value="fabric">Tecidos</TabsTrigger>
                  </TabsList>
                  <TabsContent value="additional" className="space-y-4">
                    <div className="grid gap-2">
                      {additionalServices.map((service) => (
                        <div
                          key={service.name}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">R$ {service.price.toFixed(2)}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => addItem(service, "additional")}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="fabric" className="space-y-4">
                    <div className="grid gap-2">
                      {fabricServices.map((service) => (
                        <div
                          key={service.name}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">R$ {service.price.toFixed(2)}</p>
                          </div>
                          <Button size="sm" variant="outline" type="button" onClick={() => addItem(service, "fabric")}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Quote Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Resumo do Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ageCategory && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="font-medium text-blue-900">
                      {ageCategories.find((cat) => cat.value === ageCategory)?.label}
                    </span>
                    <span className="font-semibold text-blue-900">R$ {getBasePrice().toFixed(2)}</span>
                  </div>
                )}

                {items.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Itens Adicionados:</Label>
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">R$ {item.unitPrice.toFixed(2)} cada</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" type="button" onClick={() => removeItem(item.id)}>
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">R$ {getTotal().toFixed(2)}</span>
                  </div>
                </div>

                {getTotal() > 0 && (
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                    <p className="text-sm text-center text-pink-800">
                      <strong>Orçamento válido por 30 dias</strong>
                    </p>
                    <p className="text-xs text-center text-pink-600 mt-1">Entrada de 50% para iniciar a produção</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
