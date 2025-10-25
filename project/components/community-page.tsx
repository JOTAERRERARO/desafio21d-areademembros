"use client"

import { MessageSquare, Users, Trophy, Heart, Send, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Post {
  id: string
  author: string
  avatar: string
  day: number
  content: string
  likes: number
  time: string
  user_id: string
  liked_by_user?: boolean
}

const getTimeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "agora"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min atrás`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`
  return `${Math.floor(seconds / 86400)}d atrás`
}

export function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [posting, setPosting] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const supabase = createClient()

  // Função para buscar posts do banco
  async function fetchPosts(userId: string) {
    console.log("[v0] Fetching posts for user:", userId)

    const { data: postsData, error: postsError } = await supabase
      .from("comunidade")
      .select(`
        *,
        users!comunidade_user_id_fkey(name, current_day)
      `)
      .order("data_postagem", { ascending: false })
      .limit(50)

    if (postsError) {
      console.error("[v0] Error fetching posts:", postsError)
      return
    }

    console.log("[v0] Fetched posts:", postsData?.length || 0)

    if (postsData) {
      const postsWithLikes = await Promise.all(
        postsData.map(async (post) => {
          const { count } = await supabase
            .from("curtidas")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id)

          const { data: userLike } = await supabase
            .from("curtidas")
            .select("id")
            .eq("post_id", post.id)
            .eq("user_id", userId)
            .single()

          const userData = post.users as { name?: string; current_day?: number } | null
          const initials =
            userData?.name
              ?.split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2) || "U"

          return {
            id: post.id,
            author: userData?.name || "Usuário",
            avatar: initials,
            day: userData?.current_day || 1,
            content: post.conteudo,
            likes: count || 0,
            time: getTimeAgo(post.data_postagem),
            user_id: post.user_id,
            liked_by_user: !!userLike,
          }
        }),
      )
      setPosts(postsWithLikes)
      console.log("[v0] Posts updated:", postsWithLikes.length)
    }
  }

  useEffect(() => {
    const init = async () => {
      console.log("[v0] Initializing community page")
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.error("[v0] No user found")
        return
      }

      console.log("[v0] User found:", user.id)
      setCurrentUserId(user.id)
      
      // Fetch inicial
      await fetchPosts(user.id)

      // Setup realtime - escuta novos posts
      const channel = supabase
        .channel("comunidade-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "comunidade",
          },
          (payload) => {
            console.log("[v0] New post via realtime:", payload)
            // Refetch para pegar dados completos com joins
            fetchPosts(user.id)
          },
        )
        .subscribe((status) => {
          console.log("[v0] Realtime subscription status:", status)
        })

      return () => {
        console.log("[v0] Cleaning up realtime subscription")
        supabase.removeChannel(channel)
      }
    }
    
    init()
  }, [])

  const handlePost = async () => {
    if (!newPost.trim()) return

    console.log("[v0] Posting new message:", newPost.substring(0, 50))
    setPosting(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.error("[v0] No user found when posting")
      setPosting(false)
      return
    }

    const optimisticPost: Post = {
      id: `temp-${Date.now()}`,
      author: user.email?.split("@")[0] || "Você",
      avatar: user.email?.substring(0, 2).toUpperCase() || "U",
      day: 1,
      content: newPost,
      likes: 0,
      time: "agora",
      user_id: user.id,
      liked_by_user: false,
    }

    setPosts([optimisticPost, ...posts])
    setNewPost("")

    const { data, error } = await supabase
      .from("comunidade")
      .insert({
        user_id: user.id,
        conteudo: newPost,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error posting:", error)
      setPosts(posts.filter((p) => p.id !== optimisticPost.id))
      alert("Erro ao publicar. Tente novamente.")
      setPosting(false)
      return
    }

    console.log("[v0] Post created successfully:", data)

    await fetchPosts(user.id)
    setPosting(false)
  }

  const handleLike = async (postId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const post = posts.find((p) => p.id === postId)
    if (!post) return

    if (post.liked_by_user) {
      await supabase.from("curtidas").delete().eq("post_id", postId).eq("user_id", user.id)
      setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: p.likes - 1, liked_by_user: false } : p)))
    } else {
      await supabase.from("curtidas").insert({
        post_id: postId,
        user_id: user.id,
      })
      setPosts(posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1, liked_by_user: true } : p)))
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm("Tem certeza que deseja apagar esta postagem?")) return

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Delete likes first (foreign key constraint)
    await supabase.from("curtidas").delete().eq("post_id", postId)

    // Delete the post
    const { error } = await supabase.from("comunidade").delete().eq("id", postId).eq("user_id", user.id)

    if (!error) {
      setPosts(posts.filter((p) => p.id !== postId))
    } else {
      alert("Erro ao apagar postagem")
    }
  }

  const topMembers = [
    { name: "Ana Paula", days: 21, streak: 21, avatar: "AP" },
    { name: "João Pedro", days: 21, streak: 18, avatar: "JP" },
    { name: "Fernanda Lima", days: 20, streak: 20, avatar: "FL" },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-primary via-primary-light to-accent-yellow rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
          <Users size={32} />
          COMUNIDADE ELITE
        </h1>
        <p className="text-lg opacity-90">Conecte-se com outros guerreiros do desafio</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 focus:border-primary focus:outline-none resize-none text-[#e0e0e0]"
              rows={3}
              placeholder="Compartilhe sua conquista ou motivação com a comunidade..."
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handlePost}
                disabled={posting || !newPost.trim()}
                className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={18} />
                {posting ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </div>

          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary/50 transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-yellow flex items-center justify-center font-bold">
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#e0e0e0]">{post.author}</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">Dia {post.day}</span>
                  </div>
                  <p className="text-sm text-gray-400">{post.time}</p>
                </div>
                {currentUserId === post.user_id && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title="Apagar postagem"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    post.liked_by_user ? "text-red-500" : "hover:text-primary"
                  }`}
                >
                  <Heart size={18} fill={post.liked_by_user ? "currentColor" : "none"} />
                  {post.likes}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#e0e0e0]">
              <Trophy className="text-accent-yellow" />
              TOP MEMBROS
            </h3>
            <div className="space-y-3">
              {topMembers.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg">
                  <div className="text-2xl font-black text-primary">{index + 1}</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-yellow flex items-center justify-center font-bold text-sm">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-[#e0e0e0]">{member.name}</h4>
                    <p className="text-xs text-gray-400">
                      {member.days} dias • {member.streak} sequência
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-accent-yellow/20 border border-primary rounded-xl p-6">
            <MessageSquare className="text-primary mb-3" size={28} />
            <h3 className="font-bold mb-2 text-[#e0e0e0]">Grupo no WhatsApp</h3>
            <p className="text-sm text-gray-300 mb-4">
              Entre no grupo exclusivo para trocar experiências e motivação diária!
            </p>
            <button className="w-full bg-accent-green hover:bg-accent-green/80 text-dark-bg font-bold py-2 rounded-lg transition-all">
              Entrar no Grupo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
