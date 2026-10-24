import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon, PlusIcon } from "lucide-react"
import { createClient, requireRole } from "@/lib/supabase"
import { hariIni, tanggal } from "@/lib/utils"
import { PageHeader, TransaksiTable } from "@/components/blocks"
import { DateFilter, FormDialog, SelectField } from "@/components/form"
import { buttonVariants } from "@/components/ui/button"
import { buatPembelian } from "./actions"

export const metadata: Metadata = { title: "Pembelian" }

export default async function PembelianPage({ searchParams }: PageProps<"/pembelian">) {
  await requireRole("gudang")
  const { tgl = hariIni(), baru } = (await searchParams) as { tgl?: string; baru?: string }
  const supabase = await createClient()
  const [{ data: rows }, { data: suppliers }] = await Promise.all([
    supabase.from("pembelian_list").select().eq("tanggal", tgl).order("waktu"),
    supabase.from("supplier").select("id, nama").order("nama"),
  ])

  return (
    <>
      <PageHeader title="Daftar pembelian" description="Barang masuk dari supplier. Stok bertambah otomatis dari setiap item pembelian.">
        <FormDialog
          defaultOpen={baru === "1"}
          trigger={
            <>
              <PlusIcon /> Pembelian baru
            </>
          }
          title="Pembelian baru"
          description="Pilih supplier dulu. Barang ditambahkan di langkah berikutnya."
          action={buatPembelian}
          submit={
            <>
              Lanjutkan <ArrowRightIcon />
            </>
          }
        >
          <SelectField
            label="Supplier"
            name="supplier_id"
            required
            defaultValue=""
            hint={
              <>
                Supplier belum ada?{" "}
                <Link href="/supplier/baru" className="font-semibold text-foreground underline underline-offset-4">
                  Tambah supplier
                </Link>
              </>
            }
          >
            <option value="" disabled>
              Pilih supplier
            </option>
            {suppliers?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nama}
              </option>
            ))}
          </SelectField>
        </FormDialog>
      </PageHeader>
      <TransaksiTable
        rows={rows ?? []}
        namaLabel="Supplier"
        toolbar={<DateFilter name="tgl" value={tgl} />}
        empty={<>Belum ada pembelian pada {tanggal(tgl)}.</>}
        aksi={(r) => (
          <Link href={`/pembelian/${r.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Detail
          </Link>
        )}
      />
    </>
  )
}
