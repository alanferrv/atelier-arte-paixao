"use client"

import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/auth/actions" // Import signOut action
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface UserButtonProps {
  user: SupabaseUser | null
}

export function UserButton({ user }: UserButtonProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login") // Ensure redirect after client-side logout
  }

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-2xl hover:bg-white/50 hover:scale-105 transition-all duration-300"
        onClick={() => router.push("/login")}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-2xl hover:bg-white/50 hover:scale-105 transition-all duration-300"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.email && <p className="text-sm font-medium">{user.email}</p>}
            {user.id && <p className="text-xs leading-none text-muted-foreground">ID: {user.id.substring(0, 8)}...</p>}
          </div>
        </div>
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
