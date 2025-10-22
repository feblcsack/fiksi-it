"use client"

import { motion } from "framer-motion"

interface ForumPostProps {
  post: {
    id: string
    author: string
    avatar: string
    content: string
    timestamp: string
    likes: number
    replies: number
    liked: boolean
  }
  onToggleLike: () => void
}

export default function ForumPost({ post, onToggleLike }: ForumPostProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-2xl p-5 md:p-6 backdrop-blur-sm hover:border-slate-600/50 transition-colors"
    >
      {/* Post Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 p-0.5">
            <img
              src={post.avatar || "/placeholder.svg"}
              alt={post.author}
              className="w-full h-full rounded-full object-cover bg-slate-700"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-white text-sm md:text-base">{post.author}</h3>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-500">{post.timestamp}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">@{post.author.toLowerCase().replace(" ", "")}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-4 group-hover:text-slate-100 transition-colors">
        {post.content}
      </p>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors group/reply"
        >
          <div className="p-2 rounded-full group-hover/reply:bg-cyan-400/10 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <span className="text-xs md:text-sm">{post.replies}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleLike}
          className={`flex items-center gap-2 transition-colors group/like ${
            post.liked ? "text-emerald-400" : "text-slate-500 hover:text-emerald-400"
          }`}
        >
          <div
            className={`p-2 rounded-full transition-colors ${post.liked ? "bg-emerald-400/10" : "group-hover/like:bg-emerald-400/10"}`}
          >
            <motion.svg
              className="w-4 h-4"
              fill={post.liked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ scale: post.liked ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </motion.svg>
          </div>
          <span className="text-xs md:text-sm">{post.likes}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors group/share"
        >
          <div className="p-2 rounded-full group-hover/share:bg-blue-400/10 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
}
