// Tes migrasi + seed Minimart di PGlite dengan stub skema auth Supabase.
import { PGlite } from '@electric-sql/pglite'
import { readdirSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const root = process.argv[2] ?? '.'
const sql = (f) => readFileSync(`${root}/supabase/${f}`, 'utf8')

// Database baru: stub auth + semua migrasi + seed.
async function fresh() {
  const db = new PGlite()
  await db.exec(`
    create role authenticated; create role anon;
    create schema auth;
    grant usage on schema auth to authenticated;
    create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public to authenticated;
  `)
  for (const f of readdirSync(`${root}/supabase/migrations`).sort()) await db.exec(sql(`migrations/${f}`))
  await db.exec(sql('seed.sql'))
  return db
}
const db = await fresh()

const U = { pemilik: '00000000-0000-0000-0000-000000000001', gudang: '00000000-0000-0000-0000-000000000002', kasir: '00000000-0000-0000-0000-000000000003' }
await db.exec(`
  insert into auth.users values
    ('${U.pemilik}', 'winter@minimart.local', '{}'),
    ('${U.gudang}', 'yeji@minimart.local', '{"nama":"Hwang Yeji","role":"gudang"}'),
    ('${U.kasir}', 'jiso@minimart.local', '{"nama":"Kim Jiso","role":"kasir"}');
  update profiles set role = 'pemilik' where username = 'winter';
`)

async function as(role, fn) {
  await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub', '${U[role]}', false);`)
  try { return await fn() } finally { await db.exec(`reset role;`) }
}
const q = async (sql, p) => (await db.query(sql, p)).rows
const stok = async (barcode) => (await q(`select stok from barang where barcode = $1`, [barcode]))[0].stok
const rejects = (p, re) => assert.rejects(p, re)

// profil dibuat trigger
assert.deepEqual((await q(`select username, nama, role from profiles order by username`)).map(r => r.username), ['jiso', 'winter', 'yeji'])

// gudang: pembelian menambah stok
await as('gudang', async () => {
  const [{ id }] = await q(`insert into pembelian (supplier_id) values (1) returning id`)
  await q(`insert into beli_barang (pembelian_id, barang_id, qty, harga) values ($1, 2, 10, 800)`, [id])
  assert.equal(await stok('8994834006012'), 11)
  const [pl] = await q(`select * from pembelian_list where id = $1`, [id])
  assert.equal(Number(pl.total), 8000); assert.equal(pl.nama, 'Toko Amanah')
  // gudang tidak boleh lihat penjualan
  assert.equal((await q(`select * from penjualan`)).length, 0)
  await rejects(q(`insert into penjualan default values`), /row-level security/)
})

// kasir: scan barcode, gabung qty, oversell ditolak
let pj
await as('kasir', async () => {
  ;[{ id: pj }] = await q(`insert into penjualan default values returning id`)
  await q(`select tambah_jual($1, '8996001354124', 2)`, [pj])
  await q(`select tambah_jual($1, '8996001354124')`, [pj])
  const items = await q(`select qty, harga from jual_barang where penjualan_id = $1`, [pj])
  assert.deepEqual(items, [{ qty: 3, harga: 1500 }])
  assert.equal(await stok('8996001354124'), 97)
  await rejects(q(`select tambah_jual($1, '8994834006012', 12)`, [pj]), /barang_stok_check/)
  assert.equal(await stok('8994834006012'), 11)
  await rejects(q(`select tambah_jual($1, 'tidak-ada')`, [pj]), /Barang tidak ditemukan/)
  const [pl] = await q(`select * from penjualan_list where id = $1`, [pj])
  assert.equal(Number(pl.total), 4500); assert.equal(pl.nama, 'Kim Jiso')
  // hapus penjualan mengembalikan stok
  await q(`delete from penjualan where id = $1`, [pj])
  assert.equal(await stok('8996001354124'), 100)
})

// kasir: update barang tidak berefek (RLS)
await as('kasir', () => q(`update barang set harga = 1`))
assert.equal((await q(`select min(harga) m from barang`))[0].m, 1000)

// pemilik: baca laporan, tidak bisa tulis
await as('pemilik', async () => {
  assert.equal((await q(`select * from pembelian_list`)).length, 1)
  await rejects(q(`insert into barang (barcode, nama, harga) values ('x', 'x', 1)`), /row-level security/)
})

// user nonaktif: tidak bisa baca apa pun
await db.exec(`update profiles set aktif = false where username = 'jiso'`)
await as('kasir', async () => assert.equal((await q(`select * from barang`)).length, 0))

// hapus barang yang sudah dipakai transaksi ditolak FK
await as('gudang', () => rejects(q(`delete from barang where id = 2`), /foreign key/))

// reset_demo(): stok tidak pernah minus, stok akhir sesuai target, ringkasan dashboard terisi
const demo = await fresh()
await demo.exec(`
  insert into auth.users values
    ('${U.pemilik}', 'admin@minimart.local', '{"role":"pemilik"}'),
    ('${U.kasir}', 'kasir1@minimart.local', '{"role":"kasir"}');
`)
const dq = async (s) => (await demo.query(s)).rows
for (let i = 0; i < 2; i++) await dq(`select reset_demo()`) // bisa diulang tiap malam
assert.equal((await dq(`select count(*)::int n from barang where stok < 0`))[0].n, 0)
assert.deepEqual(
  (await dq(`select nama, stok from barang where nama in ('Pocari Sweat 500 ml', 'Indomie Ayam Bawang 69 g') order by nama`)).map((r) => r.stok),
  [4, 0],
)
assert.ok((await dq(`select count(*)::int n from penjualan`))[0].n > 1000)
assert.ok((await dq(`select count(*)::int n from transaksi_bulanan where jenis = 'penjualan'`))[0].n >= 9)
assert.ok((await dq(`select count(*)::int n from barang_bulanan where jenis = 'penjualan'`))[0].n > 0)
await dq(`select demo_tambah_penjualan()`)
// tidak boleh dipanggil user lewat API
await demo.exec(`set role authenticated`)
await assert.rejects(demo.query(`select reset_demo()`), /permission denied/)
await demo.exec(`reset role`)

console.log('semua tes lolos ✅')
