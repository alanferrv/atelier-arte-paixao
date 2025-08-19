import { ModernLayout } from "@/components/modern-layout"
import { HomeContent } from "@/components/home-content"
import { getUser } from "@/app/auth/actions" // Import getUser
import { redirect } from "next/navigation"

export default async function HomePage() {
  const user = await getUser()

  if (!user) {
    redirect("/login") // Redireciona para a página de login se não houver usuário
  }

  return (
    <ModernLayout user={user}>
      {" "}
      {/* Pass user to layout */}
      <HomeContent />
    </ModernLayout>
  )
}
