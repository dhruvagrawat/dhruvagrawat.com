"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Github, ExternalLink, Code, CalendarDays, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProjectMeta } from "@/content/types"

interface ProjectsGridClientProps {
  projects: ProjectMeta[]
}

export function ProjectsGridClient({ projects }: ProjectsGridClientProps) {
  const [selected, setSelected] = useState<ProjectMeta | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.slug}
            className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-white/50 transition-all duration-300 overflow-hidden group"
            onClick={() => setSelected(project)}
          >
            {project.coverImage && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                {project.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-400 text-sm line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{project.technologies.length - 3}</Badge>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1"
                    onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" className="w-full border-zinc-700 hover:bg-zinc-800 bg-transparent">
                      <Github className="w-4 h-4 mr-2" /> Code
                    </Button>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1"
                    onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" className="w-full bg-white hover:bg-zinc-200 text-black">
                      <ExternalLink className="w-4 h-4 mr-2" /> Live
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-white hover:text-zinc-400 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
              {selected.coverImage && (
                <div className="relative h-72">
                  <Image src={selected.coverImage} alt={selected.title} fill className="object-cover" />
                </div>
              )}

              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-3">{selected.title}</h2>
                  <p className="text-zinc-300 text-lg">{selected.description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-zinc-800">
                  {selected.status && (
                    <div>
                      <p className="text-zinc-500 text-sm">Status</p>
                      <Badge className="mt-2">{selected.status}</Badge>
                    </div>
                  )}
                  {selected.startDate && (
                    <div>
                      <p className="text-zinc-500 text-sm flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" /> Started
                      </p>
                      <p className="text-white mt-2">{new Date(selected.startDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selected.teamSize && (
                    <div>
                      <p className="text-zinc-500 text-sm flex items-center gap-2">
                        <Users className="w-4 h-4" /> Team
                      </p>
                      <p className="text-white mt-2">{selected.teamSize} {selected.teamSize === 1 ? "person" : "people"}</p>
                    </div>
                  )}
                </div>

                {selected.technologies.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" /> Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selected.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selected.details && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">About</h3>
                    <p className="text-zinc-300 leading-relaxed">{selected.details}</p>
                  </div>
                )}

                {selected.galleryUrls && selected.galleryUrls.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selected.galleryUrls.map((url, i) => (
                        <div key={i} className="relative h-40 overflow-hidden rounded-lg">
                          <Image src={url} alt={`${selected.title} ${i + 1}`} fill
                            className="object-cover hover:scale-110 transition-transform duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 flex-wrap pt-2">
                  {selected.githubUrl && (
                    <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-white hover:bg-zinc-200 text-black gap-2">
                        <Github className="w-4 h-4" /> GitHub
                      </Button>
                    </a>
                  )}
                  {selected.liveUrl && (
                    <a href={selected.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-white text-white hover:bg-white/10 gap-2 bg-transparent">
                        <ExternalLink className="w-4 h-4" /> Live Site
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
