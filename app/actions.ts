"use server"

import { revalidatePath } from "next/cache"
import { getUser } from "@/app/auth/actions"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server" // Importa o cliente Supabase
import type { Client, Order, QuoteItem } from "@/types/db"

// --- Data Fetching Actions ---

export async function getHomeData() {
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }
  const CURRENT_USER_ID = user.id
  const supabase = createSupabaseServerClient()

  try {
    // Fetch Recent Orders
    const { data: recentOrders, error: ordersError } = await supabase
      .from("orders")
      .select("*, client:clients(name), product:products(name)") // Join com clients e products
      .eq("user_id", CURRENT_USER_ID)
      .order("created_at", { ascending: false })
      .limit(3)

    if (ordersError) throw ordersError

    // Calculate total revenue for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: quotesData, error: quotesError } = await supabase
      .from("quotes")
      .select("total_value")
      .eq("user_id", CURRENT_USER_ID)
      .eq("status", "Aprovado")
      .gte("created_at", thirtyDaysAgo.toISOString())

    if (quotesError) throw quotesError
    const totalRevenue = quotesData ? quotesData.reduce((sum, quote) => sum + (quote.total_value || 0), 0) : 0

    // Count active orders
    const { count: activeOrders, error: activeOrdersError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", CURRENT_USER_ID)
      .in("status", ["Em produção", "Aguardando prova"])

    if (activeOrdersError) throw activeOrdersError

    // Count happy clients (distinct clients with finalized orders)
    const { count: happyClients, error: happyClientsError } = await supabase
      .from("orders")
      .select("client_id", { count: "exact", distinct: true })
      .eq("user_id", CURRENT_USER_ID)
      .eq("status", "Finalizado")

    if (happyClientsError) throw happyClientsError

    return {
      recentOrders: (recentOrders as Order[]) || [],
      quickStats: [
        {
          label: "Receita do Mês",
          value: `R$ ${Number.parseFloat(totalRevenue.toString()).toFixed(2).replace(".", ",")}`,
          change: "+12%", // Placeholder, would require more complex date logic
          icon: "TrendingUp",
          color: "from-emerald-400 to-teal-500",
          bgColor: "from-emerald-50 to-teal-50",
        },
        {
          label: "Pedidos Ativos",
          value: String(activeOrders || 0),
          change: "+8", // Placeholder
          icon: "Scissors",
          color: "from-amber-400 to-orange-500",
          bgColor: "from-amber-50 to-orange-50",
        },
        {
          label: "Clientes Felizes",
          value: String(happyClients || 0),
          change: "+15", // Placeholder
          icon: "Heart",
          color: "from-rose-400 to-pink-500",
          bgColor: "from-rose-50 to-pink-50",
        },
      ],
    }
  } catch (error) {
    console.error("Failed to fetch home data:", error)
    return { recentOrders: [], quickStats: [] }
  }
}

export async function getDashboardData() {
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }
  const CURRENT_USER_ID = user.id
  const supabase = createSupabaseServerClient()

  try {
    // Fetch Recent Quotes
    const { data: recentQuotes, error: quotesError } = await supabase
      .from("quotes")
      .select("*, client:clients(name)") // Join com clients
      .eq("user_id", CURRENT_USER_ID)
      .order("created_at", { ascending: false })
      .limit(4)

    if (quotesError) throw quotesError

    // Fetch Agenda Hoje (example)
    const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format
    const { data: agendaHoje, error: agendaError } = await supabase
      .from("orders")
      .select("*, client:clients(name), product:products(name)") // Join com clients e products
      .eq("user_id", CURRENT_USER_ID)
      .eq("due_date", today)
      .order("due_date", { ascending: true })
      .limit(2)

    if (agendaError) throw agendaError

    return {
      recentQuotes:
        recentQuotes?.map((q) => ({
          ...q,
          value: `R$ ${Number.parseFloat(q.total_value.toString()).toFixed(2).replace(".", ",")}`,
          date: new Date(q.created_at).toLocaleDateString("pt-BR"),
          client: (q.client as { name: string })?.name || "N/A", // Acessa o nome do cliente
          service: q.description || "Orçamento Personalizado", // Usa a descrição ou um placeholder
        })) || [],
      agendaHoje:
        agendaHoje?.map((a) => ({
          id: a.id,
          client: (a.client as { name: string })?.name || "N/A", // Acessa o nome do cliente
          service: (a.product as { name: string })?.name || "Serviço Personalizado", // Acessa o nome do produto
          time: new Date(a.due_date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        })) || [],
    }
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
    return { recentQuotes: [], agendaHoje: [] }
  }
}

// --- Data Mutation Action ---

export async function createQuote(formData: FormData) {
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }
  const CURRENT_USER_ID = user.id
  const supabase = createSupabaseServerClient()

  const clientName = formData.get("clientName") as string
  const clientPhone = formData.get("clientPhone") as string
  const clientEmail = formData.get("clientEmail") as string
  const ageCategory = formData.get("ageCategory") as string
  const serviceType = formData.get("serviceType") as string
  const description = formData.get("description") as string
  const itemsJson = formData.get("items") as string // JSON string of QuoteItem[]
  const totalValue = Number.parseFloat(formData.get("totalValue") as string)

  if (!clientName || !clientEmail || !ageCategory || !serviceType || !totalValue) {
    return { success: false, message: "Missing required fields." }
  }

  try {
    // Check if client exists, otherwise create new
    let client: Client | null = null
    const { data: existingClient, error: clientFetchError } = await supabase
      .from("clients")
      .select("id, name, email, phone")
      .eq("email", clientEmail)
      .eq("user_id", CURRENT_USER_ID)
      .single()

    if (clientFetchError && clientFetchError.code !== "PGRST116") {
      // PGRST116 means "no rows found", which is expected if client doesn't exist
      throw clientFetchError
    }

    if (existingClient) {
      client = existingClient
    } else {
      const { data: newClient, error: insertClientError } = await supabase
        .from("clients")
        .insert({ user_id: CURRENT_USER_ID, name: clientName, email: clientEmail, phone: clientPhone })
        .select("id, name, email, phone")
        .single()

      if (insertClientError) throw insertClientError
      client = newClient
    }

    if (!client) {
      throw new Error("Failed to create or find client.")
    }

    // Create the quote
    const { data: newQuote, error: quoteError } = await supabase
      .from("quotes")
      .insert({
        client_id: client.id,
        user_id: CURRENT_USER_ID,
        status: "Pendente",
        total_value: totalValue,
        description: description,
        service_type: serviceType,
        age_category: ageCategory,
      })
      .select("id")
      .single()

    if (quoteError) throw quoteError
    if (!newQuote) {
      throw new Error("Failed to create quote.")
    }

    // Insert quote items
    const items: QuoteItem[] = JSON.parse(itemsJson)
    const itemsToInsert = items.map((item) => ({
      quote_id: newQuote.id,
      product_id: null, // Assuming custom items for now, adjust if products are linked
      custom_item_name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total: item.total,
    }))

    const { error: itemsError } = await supabase.from("quote_items").insert(itemsToInsert)

    if (itemsError) throw itemsError

    revalidatePath("/") // Revalidate home page to show updated stats
    revalidatePath("/orcamentos") // Revalidate quotes page

    return { success: true, message: "Orçamento criado com sucesso!" }
  } catch (error: any) {
    console.error("Failed to create quote:", error.message)
    return { success: false, message: `Erro ao criar orçamento: ${error.message}` }
  }
}
