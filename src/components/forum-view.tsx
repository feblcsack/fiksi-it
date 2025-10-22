"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ForumThread } from "./forum-thread"
import { ThreadComposer } from "./thread-composer"

interface ForumViewProps {
  bandId: string
  onBack: () => void
}

const bandData: Record<string, { name: string; genre: string }> = {
  "band-1": { name: "Payung Teduh", genre: "Indie Pop" },
  "band-2": { name: "Tulus", genre: "Alternative Rock" },
  "band-3": { name: "Kunto Aji", genre: "Soul Jazz" },
  "band-4": { name: "Hindia", genre: "Indie Folk" },
  "band-5": { name: "Navicula", genre: "Reggae" },
  "band-6": { name: "Sheila On 7", genre: "Rock" },
  "band-7": { name: "Efek Rumah Kaca", genre: "Alternative" },
  "band-8": { name: "Mocca", genre: "Indie Pop" },
}

const sampleThreads = [
  {
    id: "1",
    author: "Alex Chen",
    avatar: "/placeholder.svg?height=48&width=48",
    content: "Just discovered this band yesterday and I'm absolutely blown away! Their latest album is a masterpiece.",
    timestamp: "2 hours ago",
    likes: 234,
    replies: 45,
    liked: false,
  },
  {
    id: "2",
    author: "Jordan Smith",
    avatar: "/placeholder.svg?height=48&width=48",
    content: "Anyone going to their concert next month? Would love to meet up with fellow fans!",
    timestamp: "4 hours ago",
    likes: 156,
    replies: 32,
    liked: false,
  },
  {
    id: "3",
    author: "Sam Rivera",
    avatar: "/placeholder.svg?height=48&width=48",
    content: "The production quality on their new single is insane. Really shows how much they've evolved as artists.",
    timestamp: "6 hours ago",
    likes: 89,
    replies: 18,
    liked: false,
  },
  {
    id: "4",
    author: "Casey Morgan",
    avatar: "/placeholder.svg?height=48&width=48",
    content: "Does anyone have recommendations for similar artists? I need more music like this in my life!",
    timestamp: "8 hours ago",
    likes: 201,
    replies: 67,
    liked: false,
  },
]

export function ForumView({ bandId, onBack }: ForumViewProps) {
  const band = bandData[bandId] || { name: "Unknown Band", genre: "Music" }
  const [threads, setThreads] = useState(sampleThreads)
  const [likedThreads, setLikedThreads] = useState<Set<string>>(new Set())

  const handleAddThread = (content: string) => {
    const newThread = {
      id: String(threads.length + 1),
      author: "You",
      avatar: "/placeholder.svg?height=48&width=48",
      content,
      timestamp: "now",
      likes: 0,
      replies: 0,
      liked: false,
    }
    setThreads([newThread, ...threads])
  }

  const handleLike = (threadId: string) => {
    const newLiked = new Set(likedThreads)
    if (newLiked.has(threadId)) {
      newLiked.delete(threadId)
    } else {
      newLiked.add(threadId)
    }
    setLikedThreads(newLiked)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-foreground hover:bg-primary/10 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">{band.name}</h1>
            <p className="text-xs sm:text-sm text-foreground/60">{band.genre}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {/* Thread Composer */}
        <ThreadComposer onSubmit={handleAddThread} />

        {/* Threads */}
        <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
          {threads.map((thread, index) => (
            <div
              key={thread.id}
              className="animate-in fade-in slide-in-from-top-2 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ForumThread thread={thread} isLiked={likedThreads.has(thread.id)} onLike={() => handleLike(thread.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
