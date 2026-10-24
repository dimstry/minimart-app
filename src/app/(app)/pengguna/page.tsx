import type { Metadata } from "next"
import Link from "next/link"
import { PencilIcon, PlusIcon, UsersIcon } from "lucide-react"
import { createClient, requireRole, type Profile } from "@/lib/supabase"
import { cari, inisial, ROLE_LABEL } from "@/lib/utils"
import { EmptyRow, PageHeader, SearchForm, TableCard } from "@/components/blocks"
import { DeleteButton } from "@/components/form"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { TableCell, TableHead, TableRow } from "@/components/ui/table"
import { hapusPengguna } from "./actions"

export const metadata: Metadata = { title: "Pengguna" }

export default async function PenggunaPage({ searchParams }: PageProps<"/pengguna">) {
  const me = await requireRole("pemilik")
  const { q } = (await searchParams) as { q?: string }
  const supabase = await createClient()
  let query = supabase.from("profiles").select().order("nama")
  if (q) query = query.or(`nama.ilike.${cari(q)},username.ilike.${cari(q)}`)
  const { data: rows } = await query.overrideTypes<Profile[], { merge: false }>()

  return (
    <>
      <PageHeader title="Daftar pengguna" description="Akun yang bisa masuk ke aplikasi beserta perannya.">
        <Link href="/pengguna/baru" className={buttonVariants()}>
          <PlusIcon /> Tambah pengguna
        </Link>
      </PageHeader>
      <TableCard
        toolbar={<SearchForm q={q} placeholder="Cari username atau nama…" />}
        head={
          <>
            <TableHead>Username</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Peran</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-28 text-right">Aksi</TableHead>
          </>
        }
        note={`${rows?.length ?? 0} pengguna · ${rows?.filter((u) => u.aktif).length ?? 0} aktif`}
      >
        {!rows?.length && <EmptyRow cols={5} icon={UsersIcon} title="Pengguna tidak ditemukan" />}
        {rows?.map((u) => (
          <TableRow key={u.id}>
            <TableCell className="font-mono font-semibold">{u.username}</TableCell>
            <TableCell>
              <span className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-full bg-muted text-xs font-extrabold">{inisial(u.nama)}</span>
                {u.nama}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{ROLE_LABEL[u.role]}</Badge>
            </TableCell>
            <TableCell>
              {u.aktif ? (
                <Badge variant="secondary">
                  <span className="size-1.5 rounded-full bg-current" /> Aktif
                </Badge>
              ) : (
                <Badge variant="muted">
                  <span className="size-1.5 rounded-full border-[1.5px] border-current" /> Tidak aktif
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-0.5">
                <Link href={`/pengguna/${u.id}`} aria-label="Edit pengguna" className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground" })}>
                  <PencilIcon />
                </Link>
                {u.id === me.id ? (
                  <span className="w-10" />
                ) : (
                  <DeleteButton action={hapusPengguna.bind(null, u.id)} what="pengguna" label={u.nama} description="tidak bisa masuk lagi. Kalau sudah punya transaksi, nonaktifkan saja." />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableCard>
    </>
  )
}
