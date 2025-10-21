"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, Music, Mic2, User, HelpCircle } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  items: FAQItem[]
}

const faqCategories: FAQCategory[] = [
  {
    id: "live-gigs",
    title: "Sharing Live Gigs",
    icon: <Music className="w-6 h-6" />,
    description: "Learn how to share and manage your live performances",
    items: [
      {
        id: "live-1",
        question: "How do I upload a live gig recording?",
        answer:
          'Navigate to the "Share Live Gig" section, select your audio file, add performance details like venue and date, and click publish. Your live gig will be available to your followers immediately.',
      },
      {
        id: "live-2",
        question: "Can I edit a live gig after uploading?",
        answer:
          "Yes, you can edit the title, description, and metadata of your live gig within 24 hours of uploading. However, the audio file itself cannot be replaced once published.",
      },
      {
        id: "live-3",
        question: "What audio formats are supported for live gigs?",
        answer:
          "We support MP3, WAV, FLAC, and AAC formats. Maximum file size is 500MB. For best quality, we recommend uploading in WAV or FLAC format.",
      },
      {
        id: "live-4",
        question: "How can I promote my live gig?",
        answer:
          "Share your live gig link on social media, add it to your artist profile, and enable notifications so your followers are alerted when you upload new content.",
      },
    ],
  },
  {
    id: "cover-songs",
    title: "Uploading Cover Songs",
    icon: <Mic2 className="w-6 h-6" />,
    description: "Everything you need to know about uploading cover songs",
    items: [
      {
        id: "cover-1",
        question: "Do I need permission to upload a cover song?",
        answer:
          "Yes, you should have the proper licensing or permission from the original artist or rights holder. Our platform supports mechanical licenses, and we can help guide you through the licensing process.",
      },
      {
        id: "cover-2",
        question: "What information should I include with my cover?",
        answer:
          "Include the original artist name, original song title, your artist name, a cover image, and a brief description of your interpretation. This helps listeners find and appreciate your version.",
      },
      {
        id: "cover-3",
        question: "Can I monetize my cover songs?",
        answer:
          "Yes, once you have proper licensing in place, you can enable monetization. Revenue will be shared according to the licensing agreement and our platform policies.",
      },
      {
        id: "cover-4",
        question: "How long does it take for a cover to be published?",
        answer:
          "Most covers are published within 2-4 hours after upload. We perform quality checks to ensure audio quality and metadata accuracy. You'll receive a notification once your cover goes live.",
      },
    ],
  },
  {
    id: "account",
    title: "Account Management",
    icon: <User className="w-6 h-6" />,
    description: "Manage your profile, settings, and account preferences",
    items: [
      {
        id: "account-1",
        question: "How do I update my artist profile?",
        answer:
          "Go to Settings > Profile, where you can update your bio, profile picture, banner image, and social media links. Changes take effect immediately.",
      },
      {
        id: "account-2",
        question: "Can I have multiple artist accounts?",
        answer:
          "Each email address can have one primary artist account. If you need to manage multiple projects, you can create separate artist profiles within your account.",
      },
      {
        id: "account-3",
        question: "How do I delete my account?",
        answer:
          "You can request account deletion in Settings > Account. Your data will be permanently deleted within 30 days. This action cannot be undone.",
      },
      {
        id: "account-4",
        question: "Is my music data backed up?",
        answer:
          "Yes, all your uploads are automatically backed up on our secure servers. You can download your content at any time from your library.",
      },
    ],
  },
  {
    id: "general",
    title: "General Questions",
    icon: <HelpCircle className="w-6 h-6" />,
    description: "Common questions about the platform and features",
    items: [
      {
        id: "general-1",
        question: "Is there a cost to use the platform?",
        answer:
          "Our platform is free to use. We offer optional premium features for enhanced analytics and promotion tools. Premium subscriptions start at $9.99/month.",
      },
      {
        id: "general-2",
        question: "How do I contact support?",
        answer:
          "You can reach our support team via email at support@musicapp.com or through the in-app chat. We typically respond within 24 hours.",
      },
      {
        id: "general-3",
        question: "Can I download my music for offline listening?",
        answer:
          "Premium members can download their own uploads and favorited tracks for offline listening. Downloads are available on mobile and desktop apps.",
      },
      {
        id: "general-4",
        question: "How do I report inappropriate content?",
        answer:
          "Use the report button on any track or profile. Our moderation team reviews reports within 24 hours and takes appropriate action.",
      },
    ],
  },
]

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="group border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
        >
          <button
            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-card/80 transition-colors duration-200"
          >
            <h3 className="text-left font-semibold text-foreground text-balance">{item.question}</h3>
            <ChevronDown
              className={`w-5 h-5 text-accent flex-shrink-0 ml-4 transition-transform duration-300 ${
                expandedId === item.id ? "rotate-180" : ""
              }`}
            />
          </button>

          {expandedId === item.id && (
            <div className="px-6 py-4 bg-background/50 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-foreground/80 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("live-gigs")

  const activeData = faqCategories.find((cat) => cat.id === activeCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-balance">
              Find answers to common questions about sharing live gigs, uploading covers, and managing your account.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Category Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`group relative p-4 rounded-lg border transition-all duration-300 text-left ${
                activeCategory === category.id
                  ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                  : "border-border bg-card hover:border-accent/50 hover:bg-card/80"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    activeCategory === category.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-accent/20"
                  }`}
                >
                  {category.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{category.title}</h3>
                  <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{category.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* FAQ Content */}
        {activeData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-accent/10">{activeData.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{activeData.title}</h2>
                  <p className="text-foreground/60 mt-1">{activeData.description}</p>
                </div>
              </div>
            </div>

            <FAQAccordion items={activeData.items} />
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="bg-gradient-to-br from-accent/10 via-transparent to-transparent rounded-lg border border-accent/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">Didn't find what you're looking for?</h3>
            <p className="text-foreground/60 mb-6">Our support team is here to help. Reach out to us anytime.</p>
            <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors duration-200 shadow-lg shadow-accent/20">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
