"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { MusicItem } from "@/lib/types"

interface MusicPlayerProps {
  currentTrack: MusicItem | null
  playlist: MusicItem[]
  onTrackChange: (track: MusicItem) => void
}

export function MusicPlayer({ currentTrack, playlist, onTrackChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    // Reset state when track changes
    setCurrentTime(0)
    setIsPlaying(false)

    const setAudioData = () => {
      setDuration(audio.duration)
      if (isPlaying) {
        audio.play()
      }
    }

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play()
      } else {
        playNextTrack()
      }
    }

    // Events
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    audio.addEventListener("ended", handleEnded)

    // Cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentTrack, isPlaying, isRepeat])

  // Format time in minutes and seconds
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    const progress = progressRef.current
    if (!audio || !progress || !currentTrack) return

    const rect = progress.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audio.currentTime = percent * duration
    setCurrentTime(percent * duration)
  }

  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = value[0]
    setVolume(newVolume)
    audio.volume = newVolume

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const playPreviousTrack = () => {
    if (!currentTrack || playlist.length === 0) return

    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id)
    let newIndex

    if (isShuffle) {
      // Random track excluding current
      const availableIndices = Array.from({ length: playlist.length }, (_, i) => i).filter((i) => i !== currentIndex)
      newIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    } else {
      newIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    }

    onTrackChange(playlist[newIndex])
  }

  const playNextTrack = () => {
    if (!currentTrack || playlist.length === 0) return

    const currentIndex = playlist.findIndex((track) => track.id === currentTrack.id)
    let newIndex

    if (isShuffle) {
      // Random track excluding current
      const availableIndices = Array.from({ length: playlist.length }, (_, i) => i).filter((i) => i !== currentIndex)
      newIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    } else {
      newIndex = (currentIndex + 1) % playlist.length
    }

    onTrackChange(playlist[newIndex])
  }

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-black border-t border-zinc-800 px-4 py-2 flex items-center justify-center text-zinc-400">
        Select a track to play
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black border-t border-zinc-800 px-4 py-2 flex items-center z-50">
      <audio ref={audioRef} src={currentTrack.audio_url} preload="metadata" />

      {/* Track Info */}
      <div className="flex items-center w-1/4 min-w-[180px]">
        <div className="relative h-12 w-12 mr-3 flex-shrink-0">
          <Image
            src={currentTrack.image_url || "/placeholder.svg?height=48&width=48"}
            alt={currentTrack.title}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="truncate">
          <div className="text-sm font-medium truncate">{currentTrack.title}</div>
          <div className="text-xs text-zinc-400 truncate">{currentTrack.artist}</div>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex-1 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-1 player-controls">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white"
            onClick={() => setIsShuffle(!isShuffle)}
          >
            <Shuffle className={`h-4 w-4 ${isShuffle ? "text-[#1DB954]" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white"
            onClick={playPreviousTrack}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            onClick={togglePlay}
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full bg-white text-black hover:bg-white hover:scale-105"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white"
            onClick={playNextTrack}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white"
            onClick={() => setIsRepeat(!isRepeat)}
          >
            <Repeat className={`h-4 w-4 ${isRepeat ? "text-[#1DB954]" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 w-8 text-right">{formatTime(currentTime)}</span>
          <div
            className="player-progress flex-1 rounded-full overflow-hidden"
            onClick={handleProgressClick}
            ref={progressRef}
          >
            <div className="player-progress-filled" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
          </div>
          <span className="text-xs text-zinc-400 w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="w-1/4 min-w-[120px] flex items-center justify-end">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={toggleMute}>
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
      </div>
    </div>
  )
}
