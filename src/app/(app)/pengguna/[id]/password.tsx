"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { KeyRoundIcon, Loader2Icon, RefreshCwIcon } from "lucide-react"
import type { ActionResult } from "@/lib/supabase"
import { passwordAcak } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function salin(text: string) {
  navigator.clipboard.writeText(text).then(() => toast.success("Password disalin"))
}

// Password awal akun baru: dibuat otomatis, bisa disalin atau dibuat ulang.
export function PasswordAwal({ awal }: { awal: string }) {
  const [pw, setPw] = useState(awal)
  return (
    <div className="grid gap-2">
      <Label htmlFor="password" className="font-semibold">
        Password awal
      </Label>
      <div className="flex gap-2">
        <Input id="password" name="password" value={pw} readOnly className="border-dashed bg-muted font-mono text-base font-semibold tracking-wide" />
        <Button type="button" variant="outline" className="h-11" onClick={() => salin(pw)}>
          Salin
        </Button>
        <Button type="button" variant="outline" size="icon" className="size-11 shrink-0" aria-label="Buat ulang password" onClick={() => setPw(passwordAcak())}>
          <RefreshCwIcon />
        </Button>
      </div>
      <span className="text-[13px] text-muted-foreground">Dibuat otomatis. Berikan ke pengguna sebelum disimpan.</span>
    </div>
  )
}

export function ResetPassword({ nama, action }: { nama: string; action: () => Promise<ActionResult> }) {
  const [pw, setPw] = useState<string>()
  const [pending, startTransition] = useTransition()
  return (
    <Card size="sm" className="min-w-0 flex-[1_1_300px] gap-3.5 px-5">
      <span className="grid size-9 place-items-center rounded-[10px] bg-warning-soft text-warning-soft-foreground">
        <KeyRoundIcon className="size-[18px]" />
      </span>
      <div className="grid gap-1">
        <h3 className="text-base font-bold">Reset password</h3>
        <p className="leading-relaxed text-muted-foreground">Buat password baru untuk {nama} bila lupa. Password lama langsung tidak berlaku.</p>
      </div>
      {pw && (
        <button type="button" onClick={() => salin(pw)} className="grid gap-1.5 rounded-[20px] bg-secondary p-3 text-left" title="Klik untuk menyalin">
          <span className="text-[13px] font-semibold">Password baru</span>
          <strong className="font-mono text-lg tracking-wide">{pw}</strong>
        </button>
      )}
      <Button
        variant="outline"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const res = await action()
            if (res?.error) toast.error(res.error)
            else setPw(res?.ok)
          })
        }
      >
        {pending ? <Loader2Icon className="animate-spin" /> : null} Reset password
      </Button>
    </Card>
  )
}
