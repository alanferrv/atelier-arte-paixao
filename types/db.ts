export type Client = {
  id: string
  user_id: string
  name: string
  email: string
  phone: string | null
  created_at: Date
}

export type Product = {
  id: string
  user_id: string
  name: string
  description: string | null
  price: number
  category: string | null
  created_at: Date
}

export type Quote = {
  id: string
  client_id: string
  user_id: string
  status: string
  total_value: number
  created_at: Date
  updated_at: Date
  description: string | null
  service_type: string | null
  age_category: string | null
  client_name?: string // For join
  client_email?: string // For join
}

export type QuoteItem = {
  id: string
  quote_id: string
  product_id: string | null
  custom_item_name: string | null
  quantity: number
  unit_price: number
  total: number
}

export type Order = {
  id: string
  client_id: string
  user_id: string
  product_id: string | null
  status: string
  due_date: Date
  value: number
  priority: string
  age_category: string
  created_at: Date
  updated_at: Date
  client_name?: string // For join
  product_name?: string // For join
}

// For HomeContent quick stats
export type QuickStat = {
  label: string
  value: string
  change: string
  icon: string // Changed to string to map to Lucide icon component
  color: string
  bgColor: string
}
