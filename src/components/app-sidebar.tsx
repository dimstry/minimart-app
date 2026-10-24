"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  BarChart3Icon,
  BoxIcon,
  HomeIcon,
  LogOutIcon,
  MoonIcon,
  ReceiptTextIcon,
  ScanBarcodeIcon,
  ShoppingCartIcon,
  StoreIcon,
  SunIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react"
import type { Profile, Role } from "@/lib/supabase"
import { APP, inisial, ROLE_LABEL, TOKO } from "@/lib/utils"
import { logout } from "@/app/actions"
import { buatPenjualan } from "@/app/(app)/penjualan/actions"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const MENU: Record<Role, { href: string; label: string; icon: typeof HomeIcon }[]> = {
  pemilik: [
    { href: "/pengguna", label: "Pengguna", icon: UsersIcon },
    { href: "/laporan", label: "Laporan", icon: BarChart3Icon },
  ],
  gudang: [
    { href: "/barang", label: "Barang", icon: BoxIcon },
    { href: "/supplier", label: "Supplier", icon: TruckIcon },
    { href: "/pembelian", label: "Pembelian", icon: ShoppingCartIcon },
  ],
  kasir: [{ href: "/penjualan", label: "Penjualan", icon: ReceiptTextIcon }],
}

export function AppSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  // Layar kasir (/penjualan/123) menyalakan "Transaksi baru", bukan "Penjualan".
  const diKasir = /^\/penjualan\/\d+/.test(pathname)
  const menu = [{ href: "/beranda", label: "Beranda", icon: HomeIcon }, ...MENU[profile.role]]

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="px-3.5">
        <Link href="/beranda" className="flex items-center gap-3 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-primary text-primary-foreground">
            <StoreIcon className="size-5" />
          </span>
          <span className="grid min-w-0 group-data-[collapsible=icon]:hidden">
            <strong className="text-base font-extrabold tracking-tight">{APP}</strong>
            <span className="text-xs text-muted-foreground">
              {TOKO.nama} · {TOKO.lokasi}
            </span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-1.5">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">Menu {ROLE_LABEL[profile.role]}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
              {profile.role === "kasir" && (
                <SidebarMenuItem>
                  <form action={async () => void (await buatPenjualan())}>
                    <SidebarMenuButton type="submit" tooltip="Transaksi baru" isActive={diKasir}>
                      <ScanBarcodeIcon />
                      <span>Transaksi baru</span>
                    </SidebarMenuButton>
                  </form>
                </SidebarMenuItem>
              )}
              {menu.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    tooltip={label}
                    isActive={pathname.startsWith(href) && !(href === "/penjualan" && diKasir)}
                    render={<Link href={href} />}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mx-3.5 gap-0.5 border-t border-sidebar-border px-0 pt-3">
        <div className="flex items-center gap-2.5 px-1 pb-2.5 pt-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-[13px] font-extrabold">
            {inisial(profile.nama)}
          </span>
          <span className="grid min-w-0 group-data-[collapsible=icon]:hidden">
            <strong className="truncate text-sm font-bold">{profile.nama}</strong>
            <span className="text-xs text-muted-foreground">{ROLE_LABEL[profile.role]}</span>
          </span>
        </div>
        <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Ganti tema" className="text-muted-foreground" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              <MoonIcon className="dark:hidden" />
              <SunIcon className="hidden dark:block" />
              <span className="dark:hidden">Mode gelap</span>
              <span className="hidden dark:inline">Mode terang</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Keluar" className="font-semibold text-destructive hover:text-destructive" onClick={() => logout()}>
              <LogOutIcon />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button variant="outline" size="icon" aria-label="Ganti tema" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </Button>
  )
}

const CRUMB: Record<string, [string, string]> = {
  barang: ["Gudang", "Barang"],
  supplier: ["Gudang", "Supplier"],
  pembelian: ["Gudang", "Pembelian"],
  penjualan: ["Kasir", "Penjualan"],
  pengguna: ["Pemilik", "Pengguna"],
  laporan: ["Pemilik", "Laporan"],
}
const SUB: Record<string, string> = { baru: "Tambah", stok: "Laporan stok", label: "Cetak label", pembelian: "Pembelian", penjualan: "Penjualan" }

// "Gudang / Barang / Edit", diturunkan dari URL.
export function Crumbs() {
  const [first, second] = usePathname().split("/").filter(Boolean)
  const base = CRUMB[first]
  const parts = base ? [...base] : ["Beranda"]
  if (base && second) parts.push(SUB[second] ?? (first === "penjualan" ? "Transaksi" : first === "pembelian" ? "Detail" : "Edit"))
  return (
    <nav aria-label="Lokasi" className="flex items-center gap-2 text-sm text-muted-foreground">
      {parts.map((p, i) => (
        <span key={i} className="contents">
          {i > 0 && <span>/</span>}
          <span className={i === parts.length - 1 ? "font-semibold text-foreground" : undefined}>{p}</span>
        </span>
      ))}
    </nav>
  )
}
