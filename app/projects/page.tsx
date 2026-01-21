'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Github, ExternalLink, Code, CalendarDays, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/lib/types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        console.log('[v0] Fetching projects from API...')
        const res = await fetch('/api/projects')
        if (res.ok) {
          const data = await res.json()
          console.log('[v0] Projects fetched:', data)
          setProjects(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400">Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-white mb-12">Projects</h1>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="bg-zinc-900 border-zinc-800 cursor-pointer hover:border-white/50 transition-all duration-300 overflow-hidden group"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image_url || '/placeholder.svg'}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-400 text-sm line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies && project.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-zinc-700 hover:bg-zinc-800 bg-transparent">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button size="sm" className="w-full bg-white hover:bg-zinc-200 text-black">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute -top-10 right-0 text-white hover:text-zinc-400 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                {/* Hero Image */}
                <div className="relative h-80">
                  <Image
                    src={selectedProject.image_url || '/placeholder.svg'}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  {/* Header */}
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4">{selectedProject.title}</h2>
                    <p className="text-zinc-300 text-lg">{selectedProject.description}</p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-zinc-800">
                    {selectedProject.status && (
                      <div>
                        <p className="text-zinc-500 text-sm">Status</p>
                        <Badge className="mt-2">{selectedProject.status}</Badge>
                      </div>
                    )}
                    {selectedProject.start_date && (
                      <div>
                        <p className="text-zinc-500 text-sm flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          Started
                        </p>
                        <p className="text-white mt-2">
                          {new Date(selectedProject.start_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedProject.team_size && (
                      <div>
                        <p className="text-zinc-500 text-sm flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Team
                        </p>
                        <p className="text-white mt-2">{selectedProject.team_size} people</p>
                      </div>
                    )}
                  </div>

                  {/* Technologies */}
                  {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  {selectedProject.details && (
                    <div>
                      <h3 className="text-white font-semibold mb-3">Project Details</h3>
                      <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {selectedProject.details}
                      </p>
                    </div>
                  )}

                  {/* Gallery */}
                  {selectedProject.gallery_urls && selectedProject.gallery_urls.length > 0 && (
                    <div>
                      <h3 className="text-white font-semibold mb-3">Gallery</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedProject.gallery_urls.map((url, idx) => (
                          <div key={idx} className="relative h-40 overflow-hidden rounded-lg">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`${selectedProject.title} ${idx + 1}`}
                              fill
                              className="object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3 flex-wrap pt-4">
                    {selectedProject.github_url && (
                      <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-white hover:bg-zinc-200 text-black gap-2">
                          <Github className="w-4 h-4" />
                          GitHub Repository
                        </Button>
                      </a>
                    )}
                    {selectedProject.live_url && (
                      <a href={selectedProject.live_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="border-white text-white hover:bg-white/10 gap-2 bg-transparent">
                          <ExternalLink className="w-4 h-4" />
                          Visit Live Project
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
