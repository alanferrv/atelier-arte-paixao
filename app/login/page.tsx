import { AuthForm } from "@/components/auth-form"
import { getUser } from "@/app/auth/actions"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const user = await getUser()

  if (user) {
    redirect("/") // Se o usuário já estiver logado, redireciona para a página inicial
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-orange-100">
      {/* Elementos decorativos de fundo - tons suaves */}
      <div className="absolute inset-0">
        {/* Estrelas decorativas em tons dourados */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-amber-300/40 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-rose-300/50 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-amber-400/30 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-rose-200/60 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-amber-200/40 rounded-full animate-pulse delay-300"></div>

        {/* Formas geométricas abstratas em tons da identidade */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-rose-200/20 to-transparent rounded-full transform rotate-12"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full transform -rotate-12"></div>
        <div className="absolute bottom-20 right-32 w-64 h-64 bg-gradient-to-t from-orange-200/15 to-transparent rounded-full"></div>
      </div>

      {/* Card de Login */}
      <div className="relative z-10">
        <AuthForm />
      </div>
    </div>
  )
}
