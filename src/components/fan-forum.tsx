"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import ForumPost from "./forum-post"

interface ForumPostData {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  replies: number
  liked: boolean
}

const forumPosts: ForumPostData[] = [
  {
    id: "1",
    author: "Adi Pratama",
    avatar: "/indonesian-user-avatar.jpg",
    content: "Just watched their latest concert in Jakarta! The energy was absolutely insane 🔥 Best night ever!",
    timestamp: "2 hours ago",
    likes: 342,
    replies: 28,
    liked: false,
  },
  {
    id: "2",
    author: "Siti Nurhaliza",
    avatar: "/indonesian-user-avatar-female.jpg",
    content: "Their new album is a masterpiece. Every track hits different. Who else has been on repeat?",
    timestamp: "4 hours ago",
    likes: 521,
    replies: 45,
    liked: false,
  },
  {
    id: "3",
    author: "Budi Santoso",
    avatar: "/indonesian-user-avatar-male.jpg",
    content: "Can we talk about how incredible the production quality is? The mixing is chef's kiss 👌",
    timestamp: "6 hours ago",
    likes: 289,
    replies: 19,
    liked: false,
  },
  {
    id: "4",
    author: "Maya Kusuma",
    avatar: "/indonesian-user-avatar.jpg",
    content: "Waiting for the tour announcement! Please come to Bandung 🙏 We need you here!",
    timestamp: "8 hours ago",
    likes: 156,
    replies: 12,
    liked: false,
  },
  {
    id: "5",
    author: "Reza Wijaya",
    avatar: "/indonesian-user-avatar.jpg",
    content: "This band represents everything I love about Indonesian indie music. Proud supporter! 🇮🇩",
    timestamp: "10 hours ago",
    likes: 478,
    replies: 34,
    liked: false,
  },
]

export default function FanForum({ bandName, onBack }: { bandName: string; onBack: () => void }) {
  const [posts, setPosts] = useState<ForumPostData[]>(forumPosts)

  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="forum"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50"
        >
          <div className="max-w-2xl mx-auto px-4 py-4 md:px-6 md:py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onBack}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">{bandName}</h1>
                <p className="text-sm text-slate-400">Fan Discussion</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Live Feed</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-400 font-medium">Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Forum Content */}
        <div className="max-w-2xl mx-auto px-4 py-8 md:px-6 md:py-12">
          {/* Posts */}
          <motion.div className="space-y-4">
            <AnimatePresence>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ForumPost post={post} onToggleLike={() => toggleLike(post.id)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <button className="px-6 py-3 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800/50 transition-colors font-medium">
              Load More Posts
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
