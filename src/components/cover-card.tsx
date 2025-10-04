import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type CoverCardProps = {
  title: string
  originalArtist: string
  coverArtist: string
  imageSrc: string
  description: string
  href?: string
}

export function CoverCard({ title, originalArtist, coverArtist, imageSrc, description, href = "#" }: CoverCardProps) {
  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-title`
  return (
    <Card
      className="group h-full overflow-hidden border-border/60 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-sm hover:ring-1 hover:ring-primary/25"
      role="article"
      aria-labelledby={headingId}
    >
      <CardHeader className="space-y-3">
        <div className="aspect-square w-full overflow-hidden rounded-md border border-border/40">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={`${title} cover art`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="space-y-1">
          <CardTitle id={headingId} className="font-serif text-lg md:text-xl" title={title}>
            {title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Originally by {originalArtist} • Cover by {coverArtist}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild className="transition-transform hover:-translate-y-0.5">
            <Link href={href} aria-label={`Listen to ${title} by ${coverArtist}`}>
              Listen
            </Link>
          </Button>
          <Button size="sm" variant="secondary" asChild className="transition-transform hover:-translate-y-0.5">
            <Link href="/pricing">Get Premium</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
