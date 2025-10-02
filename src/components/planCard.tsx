"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlanCardProps = {
  name: string;
  price: string;
  period: string;
  description?: string;
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
};

export function PlanCard({
  name,
  price,
  period,
  description,
  features,
  ctaLabel,
  highlighted,
}: PlanCardProps) {
  return (
    <Card
      className={cn(
        "group relative h-full border border-border bg-card/80 transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_8px_32px_-12px_color(display-p3_var(--color-primary)/0.20)]",
        highlighted
          ? "ring-1 ring-primary/30"
          : "hover:ring-1 hover:ring-primary/20",
      )}
    >
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle
            className={cn("text-pretty font-serif text-xl tracking-tight")}
          >
            {name}
          </CardTitle>

          {highlighted ? (
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-xs",
                "border-primary/40 bg-primary/10 text-primary",
              )}
            >
              Most Popular
            </span>
          ) : null}
        </div>

        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}

        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-serif text-4xl leading-none tracking-tight">
            {price}
          </span>
          <span className="text-sm text-muted-foreground">{period}</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <ul className="space-y-3">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-1 inline-flex size-1.5 shrink-0 rounded-full",
                  "bg-primary/70 group-hover:bg-primary",
                )}
                aria-hidden="true"
              />
              <span className="text-sm leading-relaxed text-pretty">{f}</span>
            </li>
          ))}
        </ul>

        <Button
          className={cn(
            "w-full transition-transform duration-300",
            highlighted
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border border-primary/40 bg-transparent text-primary hover:bg-primary/10",
          )}
          variant={highlighted ? "default" : "outline"}
        >
          {ctaLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
