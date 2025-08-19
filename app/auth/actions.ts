"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Alterado para aceitar email e password como strings
export async function signIn(email: string, password: string) {
  const supabase = createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Erro ao fazer login:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/") // Redireciona para a página inicial após o login
}

// Alterado para aceitar email e password como strings
export async function signUp(email: string, password: string) {
  const supabase = createSupabaseServerClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error("Erro ao cadastrar:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/") // Redireciona para a página inicial após o cadastro
}

export async function signOut() {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Erro ao fazer logout:", error.message)
    return { success: false, message: error.message }
  }

  redirect("/login") // Redireciona para a página de login após o logout
}

export async function getUser() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
