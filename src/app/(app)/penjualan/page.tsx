import type { Metadata } from "next"
import Link from "next/link"
import { PencilIcon, PlusIcon, ReceiptTextIcon } from "lucide-react"
import { createClient, requireRole } from "@/lib/supabase"
import { hariIni, tanggal } from "@/lib/utils"
import { PageHeader, TransaksiTable } from "@/components/blocks"
import { ActionForm, DateFilter, DeleteButton, SubmitButton } from "@/components/form"
import { buttonVariants } from "@/components/ui/button"
import { buatPenjualan, hapusPenjualan } from "./actions"

export const metadata: Metadata = { title: "Penjualan" }

export default async function PenjualanPage({ searchParams }: PageProps<"/penjualan">) {
  await requireRole("kasir")
  const { tgl = hariIni() } = (await searchParams) as { tgl?: string }
  const supabase = await createClient()
  const { data: rows } = await supabase.from("penjualan_list").select().eq("tanggal", tgl).order("waktu")

  return (
    <>
      <PageHeader title="Daftar penjualan" description="Riwayat transaksi kasir per tanggal.">
        <ActionForm action={buatPenjualan}>
          <SubmitButton pendingLabel="Membuka kasir…">
            <PlusIcon /> Transaksi baru
          </SubmitButton>
        </ActionForm>
      </PageHeader>
      <TransaksiTable
        rows={rows ?? []}
        namaLabel="Kasir"
        toolbar={
          <>
            <DateFilter name="tgl" value={tgl} />
            <span className="text-sm text-muted-foreground">
              <strong className="font-mono text-foreground">{rows?.length ?? 0}</strong> transaksi
            </span>
          </>
        }
        empty={
          <span className="inline-flex items-center gap-1.5">
            <ReceiptTextIcon className="size-4" /> Belum ada penjualan pada {tanggal(tgl)}.
          </span>
        }
        aksi={(r) => (
          <div className="flex justify-end gap-0.5">
            <Link href={`/penjualan/${r.id}`} aria-label="Edit transaksi" className={buttonVariants({ variant: "ghost", size: "icon", className: "text-muted-foreground" })}>
              <PencilIcon />
            </Link>
            <DeleteButton action={hapusPenjualan.bind(null, r.id)} what="transaksi" label={r.kode} description="akan dihapus dan barangnya dikembalikan ke stok." />
          </div>
        )}
      />
    </>
  )
}
