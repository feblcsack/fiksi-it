"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface ThreadComposerProps {
  onSubmit: (content: string) => void
}

export function ThreadComposer({ onSubmit }: ThreadComposerProps) {
  const [content, setContent] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content)
      setContent("")
      setIsFocused(false)
    }
  }

  return (
    <div
      className={`bg-card border border-border rounded-lg p-3 sm:p-4 transition-all duration-200 ${
        isFocused ? "border-primary/50 shadow-md" : ""
      }`}
    >
      <div className="flex gap-2 sm:gap-3">
        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-primary/20 flex-shrink-0"></div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Share your thoughts about this band..."
            className="w-full bg-background border border-border rounded-lg p-2 sm:p-3 text-sm sm:text-base text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
            rows={isFocused ? 4 : 2}
          />
          <div className="flex justify-end mt-2 sm:mt-3">
            <Button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 text-xs sm:text-sm transition-all"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Post</span>
              <span className="sm:hidden">Post</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
