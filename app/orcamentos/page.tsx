import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { QuoteBuilder } from "@/components/quote-builder"
import { getUser } from "@/app/auth/actions" // Import getUser
import { redirect } from "next/navigation"

export default async function QuotesPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login") // Redireciona para a página de login se não houver usuário
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <QuoteBuilder />
      </SidebarInset>
    </SidebarProvider>
  )
}
