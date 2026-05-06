import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X, ImagePlus, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PostsService } from "@/features/posts/posts.service"
import { toast } from "sonner"

type Props = {
  onClose: () => void
  onCreated: () => void
}

const CreatePostModal = ({ onClose, onCreated }: Props) => {
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [country, setCountry] = useState("")
  const [description, setDescription] = useState("")
  const [img, setImg] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImg(file)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !location || !country || !description) return
    setLoading(true)
    try {
      await PostsService.store({ title, location, country, description, img })
      toast.success("Post creato!")
      onCreated()
      onClose()
    } catch {
      toast.error("Errore nella creazione del post.")
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
          <h2 className="text-lg font-bold text-gray-800">Nuovo viaggio</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="size-4 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Image upload */}
          <div
            className="relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden"
            style={{ minHeight: preview ? 0 : "10rem" }}
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full max-h-52 object-cover" />
            ) : (
              <>
                <ImagePlus className="size-8 text-gray-300" />
                <p className="text-sm text-gray-400">Clicca per aggiungere una foto (opzionale)</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-black">
            <div className="space-y-1.5">
              <Label htmlFor="location">Città</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="es. Tokyo" required className="border-gray-300" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country">Paese</Label>
              <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="es. Giappone" required className="border-gray-300" />
            </div>
          </div>

          <div className="space-y-1.5 text-black">
            <Label htmlFor="title">Titolo</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Il tuo titolo…" required className="border-gray-300" />
          </div>

          <div className="space-y-1.5 text-black">
            <Label htmlFor="description">Descrizione</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Racconta la tua esperienza…"
              required
              rows={4}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            {loading ? "Pubblicazione…" : "Pubblica"}
          </Button>
        </form>
      </div>
    </div>,
    document.body
  )
}

export default CreatePostModal
