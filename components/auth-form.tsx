"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { signIn, signUp } from "@/app/auth/actions"
import { Mail, Lock, Heart, Scissors, Crown } from "lucide-react"
import Image from "next/image"

export function AuthForm() {
  const [signInState, signInAction, isSignInPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      return signIn(email, password)
    },
    { success: false, message: "" },
  )
  const [signUpState, signUpAction, isSignUpPending] = useActionState(
    async (_prevState: any, formData: FormData) => {
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      return signUp(email, password)
    },
    { success: false, message: "" },
  )
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="flex space-y-0 text-xs leading-3 tracking-tight text-center items-center flex-col justify-start">
      {/* Logo do Ateliê */}
      <div className="text-center my-0 leading-7 tracking-normal border-0 border-t-0 border-b-0 border-r-0 rounded-sm border-none">
        <Image
          src="/images/atelie-logo.png"
          alt="Ateliê Arte & Paixão Baby"
          width={280}
          height={180}
          priority
          className="object-contain drop-shadow-lg animate-fade-in"
        />
      </div>

      <Card className="w-full max-w-sm mx-auto bg-white/90 backdrop-blur-sm border border-amber-200/50 shadow-warm overflow-hidden">
        {/* Ilustração no topo com cores da identidade */}
        <div className="h-32 bg-gradient-to-br from-rose-200 via-amber-100 to-orange-200 relative overflow-hidden">
          {/* Elementos decorativos da ilustração */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* "Montanhas" estilizadas como tecidos/vestidos em tons suaves */}
            <div className="relative w-full leading-7 tracking-normal mx-0 my-0 h-full border-slate-100">
              <div className="absolute bottom-0 left-4 w-16 h-20 bg-gradient-to-t from-amber-400/60 to-rose-300/40 rounded-t-full transform rotate-12"></div>
              <div className="absolute bottom-0 left-12 w-20 h-24 bg-gradient-to-t from-rose-400/60 to-amber-300/40 rounded-t-full transform -rotate-6"></div>
              <div className="absolute bottom-0 right-12 w-18 h-22 bg-gradient-to-t from-orange-400/60 to-rose-300/40 rounded-t-full transform rotate-6"></div>
              <div className="absolute bottom-0 right-4 w-14 h-18 bg-gradient-to-t from-amber-500/60 to-orange-300/40 rounded-t-full transform -rotate-12"></div>

              {/* "Sol" em tons dourados */}
              <div className="absolute top-4 right-6 w-8 h-8 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full shadow-lg">
                <div className="w-full h-full rounded-full bg-white/20"></div>
              </div>

              {/* Ícones decorativos flutuantes em tons da identidade */}
              <Heart className="absolute top-6 left-6 w-4 h-4 text-rose-400/70 animate-pulse" />
              <Scissors className="absolute top-8 left-1/2 w-3 h-3 text-amber-500/60 animate-pulse delay-500" />
              <Crown className="absolute bottom-8 right-8 w-4 h-4 text-orange-400/70 animate-pulse delay-1000" />
            </div>
          </div>
        </div>

        <CardContent className="p-8 space-y-6">
          {/* Título */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
              {isLogin ? "Bem-vinda de volta!" : "Junte-se ao Ateliê"}
            </h1>
            <p className="text-sm text-warm-600">
              {isLogin ? "Entre para acessar seu painel do ateliê" : "Crie sua conta e comece a gerenciar"}
            </p>
          </div>

          {/* Formulário */}
          <form action={isLogin ? signInAction : signUpAction} className="space-y-4">
            {/* Campo E-mail */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-warm-800 text-sm font-medium">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  className="pl-10 h-12 bg-gradient-to-r from-rose-50 to-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-200 rounded-full text-warm-800"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-warm-800 text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 h-12 bg-gradient-to-r from-rose-50 to-amber-50 border-amber-200 focus:border-amber-400 focus:ring-amber-200 rounded-full text-warm-800"
                />
              </div>
            </div>

            {/* Opções extras */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-warm-600">
                  <input type="checkbox" className="rounded border-amber-300 text-amber-500 focus:ring-amber-200" />
                  <span>Lembrar de mim</span>
                </label>
                <button type="button" className="text-amber-600 hover:text-amber-700 font-medium">
                  Esqueci a senha
                </button>
              </div>
            )}

            {/* Botão de Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-full shadow-warm transform transition-all duration-200 hover:scale-105"
              disabled={isSignInPending || isSignUpPending}
            >
              {isLogin ? (isSignInPending ? "Entrando..." : "Entrar") : isSignUpPending ? "Criando..." : "Criar Conta"}
            </Button>

            {/* Mensagens de erro */}
            {isLogin && signInState?.message && (
              <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {signInState.message}
              </p>
            )}
            {!isLogin && signUpState?.message && (
              <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {signUpState.message}
              </p>
            )}
          </form>

          {/* Toggle entre Login/Cadastro */}
          <div className="text-center">
            <p className="text-sm text-warm-600">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-600 hover:text-amber-700 font-semibold underline"
              >
                {isLogin ? "Criar Conta" : "Fazer Login"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
