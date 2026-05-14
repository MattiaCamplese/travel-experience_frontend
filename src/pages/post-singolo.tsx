import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Heart, MapPin, Compass, X, Send, CogIcon, ImagePlus, Loader2, MessageCircle, ChevronLeft } from "lucide-react"
import { Link } from "react-router"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/features/auth/auth.store"
import { CommentsService } from "@/features/posts/comments.service"
import { LikesService } from "@/features/likes/likes.service"
import { CommentLikesService } from "@/features/likes/commentLikes.service"
import { PostsService } from "@/features/posts/posts.service"
import type { SocialPost, Comment } from "@/features/posts/posts.type"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

/* ── Comment item con like ───────────────────────────── */

const CommentItem = ({ comment: c }: { comment: Comment }) => {
  const { user } = useAuthStore()
  const [liked, setLiked] = useState(c.userLikeId !== null)
  const [likeId, setLikeId] = useState<number | null>(c.userLikeId)
  const [likeCount, setLikeCount] = useState(c.likes)

  const isCurrentUser = user?.id === c.userId
  const avatarSrc = isCurrentUser
    ? (user.avatarUrl ?? `https://api.dicebear.com/9.x/rings/svg?seed=${encodeURIComponent(`${c.firstName}-${c.lastName}`)}`)
    : (c.avatarUrl ?? `https://api.dicebear.com/9.x/rings/svg?seed=${encodeURIComponent(`${c.firstName}-${c.lastName}`)}`)

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) return
    if (!liked) {
      const result = await CommentLikesService.store(user.id, c.id)
      setLikeId(result.id)
      setLiked(true)
      setLikeCount((p) => p + 1)
    } else if (likeId) {
      await CommentLikesService.destroy(likeId)
      setLikeId(null)
      setLiked(false)
      setLikeCount((p) => p - 1)
    }
  }

  return (
    <div className="flex gap-3 text-sm">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback className="bg-pink-100 text-[10px] font-bold text-pink-600 uppercase">{c.firstName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 leading-snug pt-0.5">
        <p>
          <span className="font-semibold text-gray-700 mr-1">{c.firstName} {c.lastName}</span>
          <span className="text-gray-500">{c.comment}</span>
        </p>
        {user && (
          <button
            onClick={handleLike}
            className={`mt-1 flex items-center gap-1 transition-colors ${liked ? "text-red-500" : "text-gray-300 hover:text-red-400"}`}
          >
            <Heart className={`size-3 ${liked ? "fill-red-500" : ""}`} />
            {likeCount > 0 && <span className="text-[10px]">{likeCount}</span>}
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Edit post modal ─────────────────────────────────── */

type EditPostModalProps = {
  post: SocialPost
  onClose: () => void
  onUpdated: (updated: SocialPost) => void
}

const EditPostModal = ({ post, onClose, onUpdated }: EditPostModalProps) => {
  const [title, setTitle] = useState(post.title)
  const [location, setLocation] = useState(post.location)
  const [country, setCountry] = useState(post.country)
  const [description, setDescription] = useState(post.description)
  const [img, setImg] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(post.img)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImg(file)
    setPreview((prev) => {
      if (prev && prev !== post.img) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : null
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title || !location || !country || !description) return
    setLoading(true)
    try {
      const updated = await PostsService.update(post.id, { title, location, country, description, img })
      toast.success("Post aggiornato!")
      onUpdated(updated)
      onClose()
    } catch {
      toast.error("Errore nell'aggiornamento del post.")
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Modifica viaggio</h2>
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
                <p className="text-sm text-gray-400">Clicca per cambiare la foto (opzionale)</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-black">
            <div className="space-y-1.5">
              <Label htmlFor="edit-location">Città</Label>
              <Input id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="es. Tokyo" required className="border border-gray-300" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-country">Paese</Label>
              <Input id="edit-country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="es. Giappone" required className="border border-gray-300" />
            </div>
          </div>

          <div className="space-y-1.5 text-black">
            <Label htmlFor="edit-title">Titolo</Label>
            <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Il tuo titolo…" required className="border border-gray-300" />
          </div>

          <div className="space-y-1.5 text-black">
            <Label htmlFor="edit-description">Descrizione</Label>
            <textarea
              id="edit-description"
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
            {loading ? "Salvataggio…" : "Salva modifiche"}
          </Button>
        </form>
      </div>
    </div>,
    document.body
  )
}

/* ── Post singolo ────────────────────────────────────── */

type PostSingoloProps = {
  post: SocialPost
  onClose: () => void
  liked: boolean
  likeId: number | null
  likeCount: number
  setLiked: React.Dispatch<React.SetStateAction<boolean>>
  setLikeId: React.Dispatch<React.SetStateAction<number | null>>
  setLikeCount: React.Dispatch<React.SetStateAction<number>>
  onUpdated?: (updated: SocialPost) => void
}

const PostSingolo = ({
  post,
  onClose,
  liked,
  likeId,
  likeCount,
  setLiked,
  setLikeId,
  setLikeCount,
  onUpdated,
}: PostSingoloProps) => {
  const { user } = useAuthStore()
  const [comments, setComments] = useState(post.comments)
  const [newComment, setNewComment] = useState("")
  const [sending, setSending] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isAuthor = user?.id === post.author.id

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const handleLike = async () => {
    if (!user) return
    if (!liked) {
      const result = await LikesService.store(user.id, post.id)
      setLikeId(result.id)
      setLiked(true)
      setLikeCount((p) => p + 1)
    } else if (likeId) {
      await LikesService.destroy(likeId)
      setLikeId(null)
      setLiked(false)
      setLikeCount((p) => p - 1)
    }
  }

  const handleSend = async () => {
    const text = newComment.trim()
    if (!text || !user || sending) return
    setSending(true)
    try {
      await CommentsService.store({ user_id: user.id, post_id: post.id, comment: text })
      setComments((prev) => [...prev, { id: "", comment: text, userId: user.id, firstName: user.firstName, lastName: user.lastName, avatarUrl: user.avatarUrl, likes: 0, userLikeId: null }])
      setNewComment("")
      inputRef.current?.focus()
    } catch {
      // errore silenzioso — il commento non viene aggiunto
    } finally {
      setSending(false)
    }
  }

  const authorName = `${post.author.firstName} ${post.author.lastName}`
  const initials = `${post.author.firstName[0] ?? ""}${post.author.lastName[0] ?? ""}`

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm" onClick={onClose}>
        <div className="relative flex w-[92vw] max-w-4xl h-[80vh] max-h-170 rounded-2xl overflow-hidden bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>

          {/* Edit button — solo per l'autore */}
          {isAuthor && (
            <button
              onClick={() => setEditOpen(true)}
              className="absolute top-4 right-15 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors" >
              <CogIcon className="size-4" />
            </button>
          )}

          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors">
            <X className="size-4" />
          </button>

          {/* Left – immagine full height */}
          <div className="hidden md:block w-3/5 shrink-0 bg-black h-full">
            {post.img ? (
              <img src={post.img} alt={post.title} className="w-full h-full object-contain"/>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Compass className="size-20 text-gray-500" />
              </div>
            )}
          </div>

          {/* Right – contenuto */}
          <div className="flex flex-col w-full md:w-2/5 h-full overflow-hidden bg-white">

            {/* Author header — sempre visibile */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 shrink-0">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarImage src={post.author.avatarUrl ?? `https://api.dicebear.com/9.x/rings/svg?seed=${encodeURIComponent(post.author.email)}`} />
                <AvatarFallback className="bg-pink-200 text-lg font-bold text-pink-700 uppercase">{initials}</AvatarFallback>
              </Avatar>
              <div className="leading-snug">
                {user ? (
                  <Link to={`/user/${post.author.id}`} onClick={onClose} className="text-base font-bold text-gray-800 hover:underline">
                    {authorName}
                  </Link>
                ) : (
                  <p className="text-base font-bold text-gray-800">{authorName}</p>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <MapPin className="size-3" />
                  <span>{post.location}, {post.country}</span>
                </div>
              </div>
            </div>

            {/* ── MOBILE: vista post (immagine + dettagli) ── */}
            {!showComments && (
              <div className="md:hidden flex flex-col flex-1 overflow-hidden">
                {post.img && (
                  <div className="w-full aspect-4/3 shrink-0 overflow-hidden">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
                  <h2 className="font-bold text-gray-900 text-base leading-snug">{post.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{post.description}</p>
                </div>
                <div className="shrink-0 border-t border-gray-100 px-5 py-4 flex items-center justify-between bg-white">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 transition-all active:scale-90 ${liked ? "text-red-500" : "text-gray-700 hover:text-red-400"}`}
                  >
                    <Heart className={`size-5 ${liked ? "fill-red-500" : ""}`} />
                    <span className="text-sm font-semibold">{likeCount.toLocaleString()}</span>
                  </button>
                  <button
                    onClick={() => setShowComments(true)}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <MessageCircle className="size-5" />
                    <span className="text-sm font-medium">{comments.length} commenti</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── MOBILE: vista commenti ── */}
            {showComments && (
              <div className="md:hidden flex flex-col flex-1 overflow-hidden">
                <button
                  onClick={() => setShowComments(false)}
                  className="shrink-0 flex items-center gap-1 px-4 py-3 border-b border-gray-100 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft className="size-4" />
                  Torna al post
                </button>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-xs text-gray-400">Nessun commento ancora. Sii il primo!</p>
                  ) : (
                    comments.map((c, i) => (
                      <CommentItem key={`${c.firstName}-${c.lastName}-${i}`} comment={c} />
                    ))
                  )}
                </div>
                <div className="shrink-0 border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-1.5 transition-all active:scale-90 ${liked ? "text-red-500" : "text-gray-700 hover:text-red-400"}`}
                    >
                      <Heart className={`size-5 ${liked ? "fill-red-500" : ""}`} />
                    </button>
                    <span className="text-sm font-semibold text-gray-700">{likeCount.toLocaleString()} mi piace</span>
                  </div>
                  {user ? (
                    <div className="flex items-center gap-2">
                      <Input
                        ref={inputRef}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Aggiungi un commento…"
                        className="h-9 bg-gray-50 border-gray-200 text-gray-800"
                      />
                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={!newComment.trim() || sending}
                        className="text-pink-500 hover:text-pink-700 disabled:opacity-30 transition-colors"
                      >
                        <Send className="size-5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 text-center">
                      <a href="/login" className="text-pink-500 hover:underline font-semibold">Accedi</a> per commentare.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── DESKTOP: title + description + commenti + footer ── */}
            <div className="hidden md:flex flex-col flex-1 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 shrink-0 space-y-2">
                <h2 className="font-bold text-gray-900 text-lg leading-snug">{post.title}</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{post.description}</p>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {comments.length === 0 ? (
                  <p className="text-xs text-gray-400">Nessun commento ancora. Sii il primo!</p>
                ) : (
                  comments.map((c, i) => (
                    <CommentItem key={`${c.firstName}-${c.lastName}-${i}`} comment={c} />
                  ))
                )}
              </div>
              <div className="shrink-0 border-t border-gray-100 px-6 py-5 space-y-4 bg-white">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-all duration-200 active:scale-90 ${liked ? "text-red-500" : "text-black hover:text-red-400"}`}
                  >
                    <Heart className={`size-6 ${liked ? "fill-red-500" : ""}`} />
                  </button>
                  <span className="text-sm font-semibold text-gray-700">{likeCount.toLocaleString()} mi piace</span>
                </div>
                {user ? (
                  <div className="flex items-center gap-2">
                    <Input
                      ref={inputRef}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Aggiungi un commento…"
                      className="h-10 bg-gray-50 border-gray-200 text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!newComment.trim() || sending}
                      className="text-pink-500 hover:text-pink-700 disabled:opacity-30 transition-colors"
                    >
                      <Send className="size-6" />
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl bg-pink-50 border border-pink-100 px-4 py-4 text-center">
                    <p className="text-sm text-gray-600">
                      <a href="/login" className="text-pink-500 hover:underline font-semibold">Accedi</a> per lasciare un commento o mettere like.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {editOpen && (
        <EditPostModal
          post={post}
          onClose={() => setEditOpen(false)}
          onUpdated={(updated) => {
            onUpdated?.(updated)
            setEditOpen(false)
          }}
        />
      )}
    </>,
    document.body
  )
}

export default PostSingolo
