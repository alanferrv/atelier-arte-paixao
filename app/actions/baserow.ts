"use server"

// Certifique-se de configurar esta variável de ambiente no Vercel
// com o URL da sua instância Baserow (ex: https://api.baserow.io/api/)
const BASEROW_API_URL = process.env.BASEROW_API_URL
// Certifique-se de configurar esta variável de ambiente no Vercel
// com o seu token de API do Baserow
const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN

if (!BASEROW_API_URL || !BASEROW_API_TOKEN) {
  console.error("Erro: BASEROW_API_URL ou BASEROW_API_TOKEN não estão definidos nas variáveis de ambiente.")
  throw new Error(
    "As variáveis de ambiente BASEROW_API_URL e BASEROW_API_TOKEN são necessárias para conectar ao Baserow.",
  )
}

export async function fetchBaserowTableData(tableId: string) {
  try {
    const response = await fetch(`${BASEROW_API_URL}database/rows/table/${tableId}/?user_field_names=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${BASEROW_API_TOKEN}`,
      },
      // Cache control para revalidar os dados a cada 60 segundos
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erro ao buscar dados do Baserow:", errorData)
      throw new Error(`Erro ao buscar dados do Baserow: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.results // Baserow API retorna os dados em 'results'
  } catch (error) {
    console.error("Falha ao conectar ou buscar dados do Baserow:", error)
    return { error: "Falha ao carregar dados do Baserow." }
  }
}

export async function createBaserowTableRow(tableId: string, rowData: Record<string, any>) {
  try {
    const response = await fetch(`${BASEROW_API_URL}database/rows/table/${tableId}/?user_field_names=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${BASEROW_API_TOKEN}`,
      },
      body: JSON.stringify(rowData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erro ao criar linha no Baserow:", errorData)
      throw new Error(`Erro ao criar linha no Baserow: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const newRow = await response.json()
    return newRow
  } catch (error) {
    console.error("Falha ao criar linha no Baserow:", error)
    return { error: "Falha ao criar registro no Baserow." }
  }
}

// Você pode adicionar mais funções para update, delete, etc.
