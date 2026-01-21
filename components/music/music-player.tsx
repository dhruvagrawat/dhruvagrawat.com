"use client"

import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { MusicItem } from "@/lib/types"

interface MusicPlayerProps {
  currentTrack: MusicItem | null
  playlist: MusicItem[]
  onTrackChange: (track: MusicItem) => void
  autoPlay?: boolean
}

export function MusicPlayer({
  currentTrack,
  playlist,
  onTrackChange,
  autoPlay = false,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  /** LOAD + AUTOPLAY ON TRACK CHANGE */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    audio.src = currentTrack.audio_url ?? ""
    audio.load()

    setCurrentTime(0)

    if (autoPlay) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    } else {
      setIsPlaying(false)
    }

    const onLoaded = () => setDuration(audio.duration || 0)
    const onTime = () => setCurrentTime(audio.currentTime || 0)

    const onEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        audio.play()
      } else {
        playNextTrack()
      }
    }

    audio.addEventListener("loadedmetadata", onLoaded)
    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded)
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("ended", onEnded)
    }
  }, [currentTrack, autoPlay, isRepeat])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const playPreviousTrack = () => {
    if (!currentTrack || playlist.length === 0) return
    const index = playlist.findIndex((t) => t.id === currentTrack.id)
    onTrackChange(playlist[(index - 1 + playlist.length) % playlist.length])
  }

  const playNextTrack = () => {
    if (!currentTrack || playlist.length === 0) return
    const index = playlist.findIndex((t) => t.id === currentTrack.id)
    onTrackChange(playlist[(index + 1) % playlist.length])
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

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00"
    const m = Math.floor(time / 60)
    const s = Math.floor(time % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="bg-black border-t border-zinc-800 px-4 py-3">
        <audio ref={audioRef} preload="metadata" />

        {/* MOBILE */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex items-center gap-3">
            <Image
              src={currentTrack.image_url || "/placeholder.svg"}
              alt={currentTrack.title}
              width={48}
              height={48}
              className="rounded"
            />
            <div className="truncate">
              <div className="text-sm font-medium truncate">{currentTrack.title}</div>
              <div className="text-xs text-zinc-400 truncate">{currentTrack.artist}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs w-10 text-right">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration || 0}
              step={0.1}
              onValueChange={(v) => {
                const audio = audioRef.current
                if (!audio) return
                audio.currentTime = v[0]
                setCurrentTime(v[0])
              }}
              className="flex-1"
            />
            <span className="text-xs w-10">{formatTime(duration)}</span>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={playPreviousTrack}>
              <SkipBack />
            </Button>
            <Button variant="outline" size="icon" onClick={togglePlay}>
              {isPlaying ? <Pause /> : <Play />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNextTrack}>
              <SkipForward />
            </Button>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center">
          <div className="flex items-center w-1/4 min-w-[180px]">
            <Image
              src={currentTrack.image_url || "/placeholder.svg"}
              alt={currentTrack.title}
              width={48}
              height={48}
              className="rounded mr-3"
            />
            <div className="truncate">
              <div className="text-sm font-medium truncate">{currentTrack.title}</div>
              <div className="text-xs text-zinc-400 truncate">{currentTrack.artist}</div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-auto">
            <div className="flex justify-center gap-4 mb-2">
              <Button variant="ghost" size="icon" onClick={() => setIsShuffle(!isShuffle)}>
                <Shuffle className={isShuffle ? "text-green-500" : ""} />
              </Button>
              <Button variant="ghost" size="icon" onClick={playPreviousTrack}>
                <SkipBack />
              </Button>
              <Button variant="outline" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause /> : <Play />}
              </Button>
              <Button variant="ghost" size="icon" onClick={playNextTrack}>
                <SkipForward />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsRepeat(!isRepeat)}>
                <Repeat className={isRepeat ? "text-green-500" : ""} />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs w-10 text-right">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 0}
                step={0.1}
                onValueChange={(v) => {
                  const audio = audioRef.current
                  if (!audio) return
                  audio.currentTime = v[0]
                  setCurrentTime(v[0])
                }}
                className="flex-1"
              />
              <span className="text-xs w-10">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="w-1/4 min-w-[120px] flex justify-end items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={(v) => {
                const audio = audioRef.current
                if (!audio) return
                audio.volume = v[0]
                setVolume(v[0])
                setIsMuted(v[0] === 0)
              }}
              className="w-24"
            />
          </div>
        </div>
      </div>

      {/* spacer for navbar */}
      <div className="h-[12vh] sm:h-[7vh] bg-black" />
    </div>
  )
}
