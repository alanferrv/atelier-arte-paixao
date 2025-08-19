import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createSupabaseServerClient() {
  // Adicione este console.log dentro da função createSupabaseServerClient
  // para verificar o valor do JWT Secret que está sendo lido.
  // Este log aparecerá nos logs de deploy do Vercel.
  console.log(
    "DEBUG: SUPABASE_JWT_SECRET no servidor:",
    process.env.SUPABASE_JWT_SECRET ? "Configurado" : "NÃO CONFIGURADO",
  )
  console.log("DEBUG: NEXT_PUBLIC_SUPABASE_URL no servidor:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("DEBUG: NEXT_PUBLIC_SUPABASE_ANON_KEY no servidor:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `cookies().set()` method can only be called in a Server Action or Route Handler
          // This error is safe to ignore if you're only setting cookies in a Server Action or Route Handler
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `cookies().set()` method can only be called in a Server Action or Route Handler
          // This error is safe to ignore if you're only removing cookies in a Server Action or Route Handler
        }
      },
    },
  })
}
