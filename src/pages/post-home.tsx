import { useState } from "react"
import { Heart, MessageCircle, MapPin, Compass, X } from "lucide-react"
import { Link } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import { PostsService } from "@/features/posts/posts.service"
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationPrevious, PaginationNext, PaginationEllipsis,
} from "@/components/ui/pagination"
import PostSingolo from "@/pages/post-singolo"
import { LikesService } from "@/features/likes/likes.service"
import { useAuthStore } from "@/features/auth/auth.store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { SocialPost } from "@/features/posts/posts.type"
import { createPortal } from "react-dom"

const RegisterGateModal = ({ onClose }: { onClose: () => void }) =>
  createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl p-8 flex flex-col items-center gap-5 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="size-4 text-gray-500" />
        </button>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">
          <Compass className="size-7 text-pink-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Unisciti alla community</h2>
          <p className="text-sm text-gray-500">Per vedere e commentare i post registrati</p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button className="w-full" render={<Link to="/register" />} nativeButton={false}>
            Registrati
          </Button>
          <Button variant="outline" className="w-full" render={<Link to="/login" />} nativeButton={false}>
            Accedi
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )

/* ─── Card ───────────────────────────────────────────────── */

const PostPage = ({ post }: { post: SocialPost }) => {
  const { user } = useAuthStore()
  const [liked, setLiked] = useState(post.userLikeId !== null)
  const [likeId, setLikeId] = useState<number | null>(post.userLikeId)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)

  const handleCardClick = () => {
    if (!user) { setGateOpen(true); return }
    setModalOpen(true)
  }

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
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

  const handleComments = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowComments((p) => !p)
  }

  const authorName = `${post.author.firstName} ${post.author.lastName}`
  const initials = `${post.author.firstName[0] ?? ""}${post.author.lastName[0] ?? ""}`
  const isLong = post.description.length > 100

  return (
    <>
      <article
        className="group flex flex-col overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image */}
        {post.img ? (
          <div className="relative aspect-4/3 w-full overflow-hidden">
            <img
              src={post.img}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 backdrop-blur-sm text-white">
              <MapPin className="size-3" />
              <span className="text-xs font-medium">{post.location}, {post.country}</span>
            </div>
          </div>
        ) : (
          <div className="aspect-4/3 w-full bg-linear-to-br from-pink-100 to-rose-200 flex items-center justify-center">
            <Compass className="size-12 text-pink-300" />
          </div>
        )}

        {/* Body */}
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={post.author.avatarUrl || `https://api.dicebear.com/9.x/rings/svg?seed=${encodeURIComponent(post.author.email)}`} />
              <AvatarFallback className="bg-pink-200 text-xs font-bold text-pink-700 uppercase">{initials}</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              {user ? (
                <Link to={`/user/${post.author.id}`} onClick={(e) => e.stopPropagation()} className="text-sm font-semibold text-gray-800 hover:underline">
                  {authorName}
                </Link>
              ) : (
                <p className="text-sm font-semibold text-gray-800">{authorName}</p>
              )}
              <p className="text-[11px] text-gray-700 uppercase tracking-wide">
                {new Date(post.createdAt).toLocaleDateString("it-IT")}
              </p>
            </div>
          </div>

          <h3 className="font-bold text-gray-800 leading-snug">{post.title}</h3>

          <p className="text-sm text-gray-700 leading-relaxed">
            {isLong ? `${post.description.slice(0, 100)}…` : post.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-all duration-200 active:scale-90 ${liked ? "text-red-500" : "text-gray-700 hover:text-red-400"}`}
            >
              <Heart className={`size-4.5 ${liked ? "fill-red-500" : ""}`} />
              <span className="text-xs font-medium">{likeCount.toLocaleString()}</span>
            </button>

            <button
              onClick={handleComments}
              className={`flex items-center gap-1.5 transition-colors ${showComments ? "text-gray-700" : "text-gray-700 hover:text-black"}`}
            >
              <MessageCircle className="size-4.5" />
              <span className="text-xs font-medium">{post.comments.length}</span>
            </button>
          </div>

          {/* Inline comments preview */}
          {showComments && (
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              {post.comments.length === 0 ? (
                <p className="text-xs text-gray-800">Nessun commento ancora.</p>
              ) : (
                post.comments.map((c, i) => (
                  <div key={`${c.firstName}-${c.lastName}-${i}`} className="flex gap-2 text-sm">
                    <span className="font-semibold text-gray-700 shrink-0">{c.firstName} {c.lastName}</span>
                    <span className="text-gray-500">{c.comment}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </article>

      {modalOpen && (
        <PostSingolo
          post={post}
          onClose={() => setModalOpen(false)}
          liked={liked}
          likeId={likeId}
          likeCount={likeCount}
          setLiked={setLiked}
          setLikeId={setLikeId}
          setLikeCount={setLikeCount}
        />
      )}

      {gateOpen && <RegisterGateModal onClose={() => setGateOpen(false)} />}
    </>
  )
}

/* ─── Feed ───────────────────────────────────────────────── */

const SocialFeed = ({ posts }: { posts: SocialPost[] }) => {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Scopri il Mondo</h2>
          <p className="mt-2 text-white">Le ultime avventure condivise dai viaggiatori</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...posts]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((post) => (
              <PostPage key={post.id} post={post} />
            ))}
        </div>
      </div>
    </section>
  )
}

/* ─── PostPerPage ────────────────────────────────────────── */

const PostPerPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get("page") || "1"
  function setPage(p: string) {
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), page: p })
  }
  const activePage = +page

  const { data: posts, isError, isPending } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: () => PostsService.list({ page }),
  })

  if (isError || isPending) return <></>

  const totalPages = posts.meta.last_page

  return (
    <>
      <SocialFeed posts={posts.data} />

      {totalPages > 1 && (
        <Pagination className="py-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious disabled={!posts.links.prev} onClick={() => setPage((activePage - 1).toString())} />
            </PaginationItem>

            {activePage >= 3 && (
              <PaginationItem onClick={() => setPage("1")}>
                <PaginationLink>1</PaginationLink>
              </PaginationItem>
            )}

            {activePage >= 4 && totalPages > 4 && (
              <PaginationItem><PaginationEllipsis /></PaginationItem>
            )}

            {activePage === totalPages && totalPages >= 4 && (
              <PaginationItem onClick={() => setPage((activePage - 2).toString())}>
                <PaginationLink>{activePage - 2}</PaginationLink>
              </PaginationItem>
            )}

            {activePage > 1 && (
              <PaginationItem onClick={() => setPage((activePage - 1).toString())}>
                <PaginationLink>{activePage - 1}</PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink isActive>{activePage}</PaginationLink>
            </PaginationItem>

            {activePage < totalPages && (
              <PaginationItem onClick={() => setPage((activePage + 1).toString())}>
                <PaginationLink>{activePage + 1}</PaginationLink>
              </PaginationItem>
            )}

            {activePage === 1 && totalPages >= 3 && (
              <PaginationItem onClick={() => setPage((activePage + 2).toString())}>
                <PaginationLink>{activePage + 2}</PaginationLink>
              </PaginationItem>
            )}

            {totalPages > 4 && activePage < totalPages - 2 && (
              <PaginationItem><PaginationEllipsis /></PaginationItem>
            )}

            {totalPages >= 4 && activePage < totalPages - 1 && (
              <PaginationItem onClick={() => setPage(totalPages.toString())}>
                <PaginationLink>{totalPages}</PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext disabled={!posts.links.next} onClick={() => setPage((activePage + 1).toString())} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}

export type { SocialPost }
export { PostPage, PostPerPage }
export default SocialFeed
