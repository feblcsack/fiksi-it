"use client"

import Image from "next/image"
import { useState } from "react"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ForumThreadProps {
  thread: {
    id: string
    author: string
    avatar: string
    content: string
    timestamp: string
    likes: number
    replies: number
    liked: boolean
  }
  isLiked: boolean
  onLike: () => void
}

export function ForumThread({ thread, isLiked, onLike }: ForumThreadProps) {
  const [showReplies, setShowReplies] = useState(false)

  return (
    <div className="bg-card border border-border rounded-lg p-3 sm:p-4 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start gap-2 sm:gap-3 mb-3">
        <div className="relative w-8 sm:w-10 h-8 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
          <Image src={thread.avatar || "/placeholder.svg"} alt={thread.author} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground text-sm sm:text-base">{thread.author}</p>
            <p className="text-xs sm:text-sm text-foreground/60">@{thread.author.toLowerCase().replace(" ", "")}</p>
          </div>
          <p className="text-xs text-foreground/50">{thread.timestamp}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-foreground mb-4 leading-relaxed text-sm sm:text-base">{thread.content}</p>

      <div className="flex items-center justify-between text-foreground/60 pt-3 border-t border-border/50 gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
          onClick={() => setShowReplies(!showReplies)}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">{thread.replies}</span>
          <span className="sm:hidden">{thread.replies}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 transition-colors text-xs sm:text-sm ${
            isLiked ? "text-accent hover:text-accent/80" : "text-foreground/60 hover:text-accent hover:bg-accent/10"
          }`}
          onClick={onLike}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          <span className="hidden sm:inline">{thread.likes + (isLiked ? 1 : 0)}</span>
          <span className="sm:hidden">{thread.likes + (isLiked ? 1 : 0)}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Replies Preview */}
      {showReplies && (
        <div className="mt-4 pt-4 border-t border-border/50 space-y-3 animate-in fade-in duration-200">
          <div className="bg-background/50 rounded p-3 text-sm">
            <p className="text-xs sm:text-sm font-semibold text-foreground mb-1">Popular Reply</p>
            <p className="text-xs sm:text-sm text-foreground/70">
              This is absolutely incredible! Can't wait for the next album.
            </p>
            <p className="text-xs text-foreground/50 mt-2">by Fan • 1 hour ago</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full text-primary hover:bg-primary/10 text-xs sm:text-sm">
            View all {thread.replies} replies
          </Button>
        </div>
      )}
    </div>
  )
}
