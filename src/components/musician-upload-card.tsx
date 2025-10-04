import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type MusicianUpload = {
  id: string
  title: string
  musician: string
  description: string
  imageSrc: string
  imageAlt: string
}

export function MusicianUploadCard({ upload }: { upload: MusicianUpload }) {
  return (
    <Card className="group relative h-full border-border bg-card/60 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 hover:ring-1 hover:ring-primary/25">
      <CardHeader>
        <div className="overflow-hidden rounded-md border border-border">
          {/* Using a placeholder image for album art */}
          <img
            src={`${upload.imageSrc}`}
            alt={upload.imageAlt}
            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
        <CardTitle className="mt-4 font-serif text-xl tracking-tight text-foreground">{upload.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">by {upload.musician}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{upload.description}</p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="bg-primary/10 text-foreground hover:bg-primary/20 transition-colors">
            View
          </Button>
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-primary/10 transition-colors bg-transparent"
          >
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
