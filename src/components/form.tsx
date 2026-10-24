"use client"

import {
  createContext,
  useContext,
  useState,
  useTransition,
  type ComponentProps,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { CalendarIcon, CircleAlertIcon, EyeIcon, EyeOffIcon, Loader2Icon, PrinterIcon, Trash2Icon } from "lucide-react"
import type { ActionResult } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Action = (formData: FormData) => Promise<ActionResult | void>

const Pending = createContext(false)

// Form yang memanggil Server Action lalu menampilkan hasilnya sebagai toast.
// Pakai onSubmit (bukan <form action>) supaya isian tidak di-reset otomatis saat error.
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess,
  inlineError,
  onDone,
}: {
  action: Action
  children: ReactNode
  className?: string
  resetOnSuccess?: boolean
  inlineError?: boolean
  onDone?: (res: ActionResult | void) => void
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string>()

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form, (e.nativeEvent as SubmitEvent).submitter)
    startTransition(async () => {
      const res = await action(formData)
      if (inlineError) setError(res?.error)
      else if (res?.error) toast.error(res.error)
      if (res?.ok) toast.success(res.ok)
      if (!res?.error && resetOnSuccess) form.reset()
      onDone?.(res)
    })
  }

  return (
    <form onSubmit={onSubmit} aria-busy={pending} className={cn("aria-busy:pointer-events-none", className)}>
      {error && (
        <div role="alert" className="flex items-start gap-2.5 rounded-[20px] bg-danger-soft px-3.5 py-3 text-sm text-danger-soft-foreground">
          <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong>Gagal.</strong> {error}
          </span>
        </div>
      )}
      <Pending value={pending}>{children}</Pending>
    </form>
  )
}

// Tombol submit yang berubah jadi spinner + label proses selama action berjalan.
export function SubmitButton({ children, pendingLabel, ...props }: ComponentProps<typeof Button> & { pendingLabel?: string }) {
  const pending = useContext(Pending)
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending && pendingLabel ? (
        <>
          <Loader2Icon className="animate-spin" /> {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  )
}

type FieldProps = { label: string; hint?: ReactNode; prefix?: string; className?: string }

function FieldWrap({ label, hint, className, id, children }: Omit<FieldProps, "prefix"> & { id?: string; children: ReactNode }) {
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      {children}
      {hint && <span className="text-[13px] text-muted-foreground">{hint}</span>}
    </div>
  )
}

export function Field({ label, hint, prefix, className, ...props }: FieldProps & ComponentProps<"input">) {
  const id = props.id ?? props.name
  const input = <Input id={id} {...props} className={cn(prefix && "rounded-l-none text-right font-mono")} />
  return (
    <FieldWrap label={label} hint={hint} className={className} id={id}>
      {prefix ? (
        <div className="flex">
          <span className="inline-flex items-center rounded-l-2xl border border-r-0 border-input bg-muted px-3 text-sm font-semibold text-muted-foreground">
            {prefix}
          </span>
          {input}
        </div>
      ) : (
        input
      )}
    </FieldWrap>
  )
}

const nativeControl =
  "w-full rounded-2xl border border-input bg-card px-3 text-[15px] outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring"

export function TextareaField({ label, hint, className, ...props }: FieldProps & ComponentProps<"textarea">) {
  return (
    <FieldWrap label={label} hint={hint} className={className} id={props.name}>
      <textarea id={props.name} rows={3} className={cn(nativeControl, "resize-y py-2.5 leading-normal")} {...props} />
    </FieldWrap>
  )
}

export function SelectField({ label, hint, className, children, ...props }: FieldProps & ComponentProps<"select">) {
  return (
    <FieldWrap label={label} hint={hint} className={className} id={props.name}>
      <select id={props.name} className={cn(nativeControl, "h-11")} {...props}>
        {children}
      </select>
    </FieldWrap>
  )
}

export function PasswordField({ label, ...props }: { label: string } & ComponentProps<"input">) {
  const [show, setShow] = useState(false)
  return (
    <FieldWrap label={label} id={props.name}>
      <div className="relative">
        <Input id={props.name} type={show ? "text" : "password"} className="pr-12" {...props} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-0.5 right-0.5 text-muted-foreground"
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    </FieldWrap>
  )
}

// Konfirmasi hapus. `what` = jenis data ("barang"), `label` = namanya.
export function DeleteButton({
  action,
  what = "data",
  label,
  description = "Tindakan ini tidak bisa dibatalkan.",
  trigger,
}: {
  action: Action
  what?: string
  label?: string
  description?: string
  trigger?: ReactElement
}) {
  const [open, setOpen] = useState(false)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={trigger ?? <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label={`Hapus ${what}`} />}
      >
        {!trigger && <Trash2Icon />}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Hapus {what} ini?</AlertDialogTitle>
          <AlertDialogDescription>
            {label && <strong className="text-foreground">{label}</strong>} {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ActionForm action={action} onDone={(res) => !res?.error && setOpen(false)}>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <SubmitButton variant="destructive" pendingLabel="Menghapus…">
              Ya, hapus
            </SubmitButton>
          </AlertDialogFooter>
        </ActionForm>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function PrintButton() {
  return (
    <Button variant="outline" onClick={() => window.print()}>
      <PrinterIcon /> Cetak
    </Button>
  )
}

// Filter tanggal lewat query string. Satu tanggal: langsung terkirim saat diganti.
export function DateFilter({ name, value }: { name: string; value: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const go = (v: string) => router.push(v ? `${pathname}?${name}=${v}` : pathname)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Label htmlFor={name} className="text-sm font-semibold">
        Tanggal
      </Label>
      <div className="relative">
        <CalendarIcon className="pointer-events-none absolute top-3 left-3.5 size-4 text-muted-foreground" />
        <Input id={name} type="date" defaultValue={value} key={value} onChange={(e) => go(e.target.value)} className="h-10 w-44 pl-10 font-mono text-sm md:text-sm" />
      </div>
      <Button variant="outline" onClick={() => go("")}>
        Hari ini
      </Button>
    </div>
  )
}

// Tombol yang membuka dialog berisi form kecil (mis. pilih supplier sebelum pembelian baru).
export function FormDialog({
  trigger,
  title,
  description,
  action,
  submit,
  defaultOpen,
  children,
}: {
  trigger: ReactNode
  title: string
  description?: string
  action: Action
  submit: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}) {
  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger render={<Button />}>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="pr-8">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <ActionForm action={action} className="grid gap-5">
          {children}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
            <SubmitButton pendingLabel="Memproses…">{submit}</SubmitButton>
          </DialogFooter>
        </ActionForm>
      </DialogContent>
    </Dialog>
  )
}
