import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X, Loader2, Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/features/auth/auth.store"
import { UsersService } from "@/features/users/users.service"
import { toast } from "sonner"

type Props = {
  onClose: () => void
}

const UpdateUserModal = ({ onClose }: Props) => {
  const { user, updateUser } = useAuthStore()
  const [firstName, setFirstName] = useState(user?.firstName ?? "")
  const [lastName, setLastName] = useState(user?.lastName ?? "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase()
  const defaultAvatar = user?.avatarUrl ?? `https://api.dicebear.com/9.x/rings/svg?seed=${encodeURIComponent(user?.email ?? "")}`

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setAvatarFile(file)
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return
    if (password && !currentPassword) {
      toast.error("Inserisci la password attuale per cambiarla.")
      return
    }
    if (password && password !== passwordConfirm) {
      toast.error("Le password non coincidono.")
      return
    }
    setLoading(true)
    try {
      const payload: Record<string, string> = {
        firstName,
        lastName,
      }
      if (password) {
        payload.currentPassword = currentPassword
        payload.password = password
        payload.passwordConfirmation = passwordConfirm
      }

      const [newAvatarUrl] = await Promise.all([
        avatarFile ? UsersService.updateAvatar(user.id, avatarFile) : Promise.resolve(undefined),
        UsersService.update(user.id, payload),
      ])

      updateUser({
        firstName,
        lastName,
        ...(newAvatarUrl !== undefined ? { avatarUrl: newAvatarUrl } : {}),
      })
      toast.success("Profilo aggiornato!")
      onClose()
    } catch {
      toast.error("Errore nell'aggiornamento del profilo.")
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Impostazioni profilo</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="size-4 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Avatar upload */}
          <div className="flex justify-center">
            <div className="relative group">
              <Avatar className="h-20 w-20 shadow ring-4 ring-gray-100 cursor-pointer" onClick={() => fileRef.current?.click()}>
                <AvatarImage src={avatarPreview ?? defaultAvatar} />
                <AvatarFallback className="bg-pink-200 text-xl font-bold text-pink-700">{initials}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil className="size-5 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
            </div>
          </div>

          {/* Nome / Cognome */}
          <div className="grid grid-cols-2 gap-3 text-black">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Il tuo nome"
                required
                className="border-gray-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Cognome</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Il tuo cognome"
                required
                className="border-gray-300"
              />
            </div>
          </div>

          {/* Password attuale */}
          <div className="space-y-1.5 text-black">
            <Label htmlFor="currentPassword">Password attuale</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Richiesta solo se vuoi cambiarla"
              className="border-gray-300"
            />
          </div>

          {/* Password / Conferma */}
          <div className="grid grid-cols-2 gap-3 text-black">
            <div className="space-y-1.5">
              <Label htmlFor="password">Nuova password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Lascia vuoto per non cambiarla"
                className="border-gray-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="passwordConfirm">Conferma password</Label>
              <Input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Ripeti la password"
                className="border-gray-300"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            {loading ? "Salvataggio…" : "Salva modifiche"}
          </Button>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default UpdateUserModal
