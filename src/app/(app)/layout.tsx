import { requireRole } from "@/lib/supabase"
import { AppSidebar, Crumbs } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const profile = await requireRole()
  return (
    <SidebarProvider>
      <AppSidebar profile={profile} />
      <SidebarInset className="bg-transparent">
        <header className="flex min-h-[72px] items-center gap-3 px-4 pt-3 md:px-6 print:hidden">
          <SidebarTrigger className="size-9" />
          <span className="h-5 w-px bg-foreground/15" />
          <Crumbs />
        </header>
        <div className="flex w-full max-w-[1180px] flex-1 flex-col gap-6 px-4 pb-10 md:px-8 print:max-w-none print:p-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
