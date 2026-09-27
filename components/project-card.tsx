/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


function SimpleMarkdown({ children }: { children: string }) {
  return (
    <div>
      {children.split("\n\n").map((para, idx) => (
        <p key={idx} className="m-0">
          {para.split("\n").reduce((acc: any[], line, i) => {
            if (i > 0) acc.push(<br key={i} />);
            acc.push(line);
            return acc;
          }, [])}
        </p>
      ))}
    </div>
  );
}


function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <ProjectPlaceholder title={alt} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-48 object-cover"
      onError={() => setImageError(true)}
    />
  );
}

function MaybeLink({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (!href) return <div className={className}>{children}</div>;
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </Link>
  );
}

// Shown when a project has no screenshot yet: a dotted panel with the
// project's initials and first couple of technologies, instead of a flat grey box.
function ProjectPlaceholder({
  title,
  tags = [],
}: {
  title: string;
  tags?: readonly string[];
}) {
  const initials = title
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <div className="relative w-full h-48 bg-muted overflow-hidden flex items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:12px_12px]"
      />
      <div className="relative flex flex-col items-center gap-2">
        <div className="size-14 rounded-2xl border bg-background shadow-sm flex items-center justify-center text-lg font-semibold tracking-tight text-foreground">
          {initials}
        </div>
        {tags.length > 0 && (
          <span className="text-[11px] font-mono text-muted-foreground">
            {tags.slice(0, 2).join(" · ")}
          </span>
        )}
      </div>
    </div>
  );
}

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col h-full border border-border rounded-xl overflow-hidden hover:ring-2 hover:ring-muted transition-all duration-200",
        className
      )}
    >
      <div className="relative shrink-0">
        <MaybeLink href={href} className="block">
          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-48 object-cover"
            />
          ) : image ? (
            <ProjectImage src={image} alt={title} />
          ) : (
            <ProjectPlaceholder title={title} tags={tags} />
          )}
        </MaybeLink>
        {links && links.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-2">
            {links.map((link, idx) => (
              <Link
                href={link.href}
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Badge
                  className="flex items-center gap-1.5 text-xs bg-black text-white hover:bg-black/90"
                  variant="default"
                >
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{title}</h3>
            <time className="text-xs text-muted-foreground">{dates}</time>
          </div>
          {href && (
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              aria-label={`Open ${title}`}
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>
        <div className="text-xs flex-1 prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <SimpleMarkdown>{description}</SimpleMarkdown>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="text-[11px] font-medium border border-border h-6 w-fit px-2"
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
