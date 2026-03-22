'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Plus, ChevronLeft, ChevronRight, Clock, Calendar, GripVertical } from 'lucide-react'

/* ═══════════════════════════════════════════
   TIMEZONE DATA
═══════════════════════════════════════════ */
const ALL_TIMEZONES = [
    { id: 'Asia/Kolkata', label: 'India', city: 'New Delhi', flag: '🇮🇳' },
    { id: 'Asia/Dubai', label: 'Dubai', city: 'Dubai', flag: '🇦🇪' },
    { id: 'Europe/London', label: 'London', city: 'London', flag: '🇬🇧' },
    { id: 'Australia/Brisbane', label: 'Brisbane', city: 'Brisbane', flag: '🇦🇺' },
    { id: 'Asia/Tokyo', label: 'Japan', city: 'Tokyo', flag: '🇯🇵' },
    { id: 'America/Toronto', label: 'Toronto', city: 'Toronto', flag: '🇨🇦' },
    { id: 'America/Los_Angeles', label: 'California', city: 'Los Angeles', flag: '🇺🇸' },
    { id: 'America/New_York', label: 'New York', city: 'New York', flag: '🇺🇸' },
    { id: 'America/Chicago', label: 'Chicago', city: 'Chicago', flag: '🇺🇸' },
    { id: 'America/Denver', label: 'Denver', city: 'Denver', flag: '🇺🇸' },
    { id: 'America/Phoenix', label: 'Phoenix', city: 'Phoenix', flag: '🇺🇸' },
    { id: 'America/Vancouver', label: 'Vancouver', city: 'Vancouver', flag: '🇨🇦' },
    { id: 'America/Sao_Paulo', label: 'São Paulo', city: 'São Paulo', flag: '🇧🇷' },
    { id: 'America/Mexico_City', label: 'Mexico City', city: 'Mexico City', flag: '🇲🇽' },
    { id: 'Europe/Paris', label: 'Paris', city: 'Paris', flag: '🇫🇷' },
    { id: 'Europe/Berlin', label: 'Berlin', city: 'Berlin', flag: '🇩🇪' },
    { id: 'Europe/Amsterdam', label: 'Amsterdam', city: 'Amsterdam', flag: '🇳🇱' },
    { id: 'Europe/Madrid', label: 'Madrid', city: 'Madrid', flag: '🇪🇸' },
    { id: 'Europe/Rome', label: 'Rome', city: 'Rome', flag: '🇮🇹' },
    { id: 'Europe/Istanbul', label: 'Istanbul', city: 'Istanbul', flag: '🇹🇷' },
    { id: 'Europe/Moscow', label: 'Moscow', city: 'Moscow', flag: '🇷🇺' },
    { id: 'Asia/Singapore', label: 'Singapore', city: 'Singapore', flag: '🇸🇬' },
    { id: 'Asia/Hong_Kong', label: 'Hong Kong', city: 'Hong Kong', flag: '🇭🇰' },
    { id: 'Asia/Shanghai', label: 'Shanghai', city: 'Shanghai', flag: '🇨🇳' },
    { id: 'Asia/Seoul', label: 'Seoul', city: 'Seoul', flag: '🇰🇷' },
    { id: 'Asia/Bangkok', label: 'Bangkok', city: 'Bangkok', flag: '🇹🇭' },
    { id: 'Asia/Jakarta', label: 'Jakarta', city: 'Jakarta', flag: '🇮🇩' },
    { id: 'Asia/Karachi', label: 'Karachi', city: 'Karachi', flag: '🇵🇰' },
    { id: 'Asia/Dhaka', label: 'Dhaka', city: 'Dhaka', flag: '🇧🇩' },
    { id: 'Asia/Colombo', label: 'Colombo', city: 'Colombo', flag: '🇱🇰' },
    { id: 'Asia/Riyadh', label: 'Riyadh', city: 'Riyadh', flag: '🇸🇦' },
    { id: 'Asia/Tehran', label: 'Tehran', city: 'Tehran', flag: '🇮🇷' },
    { id: 'Africa/Cairo', label: 'Cairo', city: 'Cairo', flag: '🇪🇬' },
    { id: 'Africa/Lagos', label: 'Lagos', city: 'Lagos', flag: '🇳🇬' },
    { id: 'Africa/Nairobi', label: 'Nairobi', city: 'Nairobi', flag: '🇰🇪' },
    { id: 'Africa/Johannesburg', label: 'Johannesburg', city: 'Johannesburg', flag: '🇿🇦' },
    { id: 'Pacific/Auckland', label: 'Auckland', city: 'Auckland', flag: '🇳🇿' },
    { id: 'Pacific/Sydney', label: 'Sydney', city: 'Sydney', flag: '🇦🇺' },
    { id: 'Pacific/Honolulu', label: 'Honolulu', city: 'Honolulu', flag: '🇺🇸' },
    { id: 'Atlantic/Reykjavik', label: 'Reykjavik', city: 'Reykjavik', flag: '🇮🇸' },
    { id: 'America/Buenos_Aires', label: 'Buenos Aires', city: 'Buenos Aires', flag: '🇦🇷' },
    { id: 'America/Bogota', label: 'Bogotá', city: 'Bogotá', flag: '🇨🇴' },
    { id: 'Asia/Kathmandu', label: 'Kathmandu', city: 'Kathmandu', flag: '🇳🇵' },
    { id: 'Asia/Yangon', label: 'Yangon', city: 'Yangon', flag: '🇲🇲' },
    { id: 'Australia/Melbourne', label: 'Melbourne', city: 'Melbourne', flag: '🇦🇺' },
    { id: 'Australia/Perth', label: 'Perth', city: 'Perth', flag: '🇦🇺' },
    { id: 'Pacific/Fiji', label: 'Fiji', city: 'Suva', flag: '🇫🇯' },
    { id: 'America/Anchorage', label: 'Anchorage', city: 'Anchorage', flag: '🇺🇸' },
]

const DEFAULT_IDS = [
    'Asia/Kolkata', 'Asia/Dubai', 'Europe/London',
    'Australia/Brisbane', 'Asia/Tokyo', 'America/Toronto', 'America/Los_Angeles',
]

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function getUTCOffset(tzId: string, date: Date): number {
    const tzStr = date.toLocaleString('en-US', { timeZone: tzId })
    const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' })
    return (new Date(tzStr).getTime() - new Date(utcStr).getTime()) / 3600000
}
function fmtTime(date: Date, tzId: string, h12: boolean): string {
    return date.toLocaleTimeString('en-US', { timeZone: tzId, hour: '2-digit', minute: '2-digit', hour12: h12 })
}
function fmtDate(date: Date, tzId: string): string {
    return date.toLocaleDateString('en-US', { timeZone: tzId, weekday: 'short', month: 'short', day: 'numeric' })
}
function hourLabel(h: number, h12: boolean): string {
    if (!h12) return String(h).padStart(2, '0')
    if (h === 0) return '12a'
    if (h === 12) return '12p'
    return h < 12 ? `${h}a` : `${h - 12}p`
}
function slotColor(lh: number): { bg: string; text: string } {
    if (lh >= 22 || lh < 6) return { bg: 'rgba(24,24,27,0.8)', text: '#52525b' }
    if (lh >= 9 && lh < 18) return { bg: 'rgba(16,185,129,0.1)', text: '#6ee7b7' }
    return { bg: 'rgba(63,63,70,0.45)', text: '#a1a1aa' }
}

/* ═══════════════════════════════════════════
   MINI CALENDAR
═══════════════════════════════════════════ */
function MiniCalendar({ selected, onChange }: { selected: Date; onChange: (d: Date) => void }) {
    const [view, setView] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1))
    const year = view.getFullYear(), month = view.getMonth()
    const firstDow = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
    while (cells.length % 7 !== 0) cells.push(null)
    const today = new Date()
    const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    const isSelected = (d: number) => d === selected.getDate() && month === selected.getMonth() && year === selected.getFullYear()
    return (
        <div className="p-3 w-56">
            <div className="flex items-center justify-between mb-3">
                <button onClick={() => setView(new Date(year, month - 1, 1))} className="p-1 rounded hover:bg-white/8 text-zinc-400 hover:text-white transition-colors"><ChevronLeft size={13} /></button>
                <span className="text-xs font-semibold text-zinc-300">{MONTHS[month]} {year}</span>
                <button onClick={() => setView(new Date(year, month + 1, 1))} className="p-1 rounded hover:bg-white/8 text-zinc-400 hover:text-white transition-colors"><ChevronRight size={13} /></button>
            </div>
            <div className="grid grid-cols-7 gap-px mb-1">
                {DAYS.map(d => <div key={d} className="text-center text-[9px] text-zinc-600 font-medium">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-px">
                {cells.map((d, i) => (
                    <button key={i} disabled={!d} onClick={() => d && onChange(new Date(year, month, d))}
                        className={`h-7 w-full rounded text-[11px] font-mono transition-all
              ${!d ? 'invisible' : ''}
              ${d && isSelected(d) ? 'bg-white text-black font-bold' : ''}
              ${d && isToday(d) && !isSelected(d) ? 'text-blue-400 font-semibold' : ''}
              ${d && !isSelected(d) && !isToday(d) ? 'text-zinc-400 hover:bg-white/8 hover:text-white' : ''}`}>
                        {d}
                    </button>
                ))}
            </div>
            <div className="mt-3 pt-2 border-t border-white/6 flex justify-center">
                <button onClick={() => { const t = new Date(); onChange(new Date(t.getFullYear(), t.getMonth(), t.getDate())) }}
                    className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">Jump to today</button>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   TIME RANGE BAR
═══════════════════════════════════════════ */
function TimeRangeBar({ rangeStart, rangeEnd, onRangeChange, hoveredHour, fmt }: {
    rangeStart: number | null; rangeEnd: number | null
    onRangeChange: (s: number | null, e: number | null) => void
    hoveredHour: number | null; fmt: boolean
}) {
    const hasRange = rangeStart !== null && rangeEnd !== null
    const s = rangeStart ?? 0, e = rangeEnd ?? 23
    const HOURS = Array.from({ length: 24 }, (_, i) => i)
    function handleClick(h: number) {
        if (!hasRange) { onRangeChange(h, Math.min(h + 1, 23)) }
        else if (h < s) { onRangeChange(h, e) }
        else if (h > e) { onRangeChange(s, h) }
        else { onRangeChange(null, null) }
    }
    const inR = (h: number) => hasRange && h >= s && h <= e
    return (
        <div className="px-4 py-3 border-t border-white/6">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Time Range</span>
                {hasRange ? (
                    <>
                        <span className="text-[11px] font-mono text-zinc-300 bg-white/8 px-2 py-0.5 rounded">
                            {hourLabel(s, fmt)} – {hourLabel(Math.min(e + 1, 23), fmt)}
                        </span>
                        <button onClick={() => onRangeChange(null, null)} className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">clear</button>
                    </>
                ) : <span className="text-[10px] text-zinc-600">Click a slot to set range</span>}
            </div>
            <div className="flex gap-px">
                {HOURS.map(h => (
                    <button key={h} onClick={() => handleClick(h)} title={hourLabel(h, fmt)}
                        className={`flex-1 h-4 rounded-sm transition-all
              ${inR(h) ? (h === s || h === e ? 'bg-blue-400' : 'bg-blue-400/30') : hoveredHour === h ? 'bg-white/20' : 'bg-white/6 hover:bg-white/12'}`} />
                ))}
            </div>
            <div className="flex justify-between mt-1 pointer-events-none">
                {[0, 6, 12, 18, 23].map(h => <span key={h} className="text-[9px] text-zinc-700 font-mono">{hourLabel(h, fmt)}</span>)}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function Page() {
    const [activeIds, setActiveIds] = useState<string[]>(DEFAULT_IDS)
    const [now, setNow] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date>(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()) })
    const [fmt12, setFmt12] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const [showCal, setShowCal] = useState(false)
    const [search, setSearch] = useState('')
    const [hoveredHour, setHoveredHour] = useState<number | null>(null)
    const [rangeStart, setRangeStart] = useState<number | null>(null)
    const [rangeEnd, setRangeEnd] = useState<number | null>(null)

    // Drag state — use refs to avoid re-render during drag
    const dragIdxRef = useRef<number | null>(null)
    const [dropIdx, setDropIdx] = useState<number | null>(null)
    const [draggingIdx, setDraggingIdx] = useState<number | null>(null)

    const addRef = useRef<HTMLDivElement>(null)
    const calRef = useRef<HTMLDivElement>(null)
    const hoverRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(t)
    }, [])

    useEffect(() => {
        function h(e: MouseEvent) {
            if (addRef.current && !addRef.current.contains(e.target as Node)) setShowAdd(false)
            if (calRef.current && !calRef.current.contains(e.target as Node)) setShowCal(false)
        }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    // Debounced hover — eliminates jitter when moving fast
    const handleHoverEnter = useCallback((h: number) => {
        if (hoverRef.current) clearTimeout(hoverRef.current)
        hoverRef.current = setTimeout(() => setHoveredHour(h), 40)
    }, [])
    const handleHoverLeave = useCallback(() => {
        if (hoverRef.current) clearTimeout(hoverRef.current)
        hoverRef.current = setTimeout(() => setHoveredHour(null), 80)
    }, [])

    const dayBase = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()))
    const today = new Date()
    const todayBase = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
    const isToday = dayBase.getTime() === todayBase.getTime()
    const dayLabel = isToday ? 'Today' : selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const activeTZs = ALL_TIMEZONES.filter(tz => activeIds.includes(tz.id))
    const addableTZs = ALL_TIMEZONES.filter(tz =>
        !activeIds.includes(tz.id) &&
        (tz.label.toLowerCase().includes(search.toLowerCase()) || tz.city.toLowerCase().includes(search.toLowerCase()))
    )
    const nowHourUTC = now.getUTCHours()
    const SLOTS = Array.from({ length: 24 }, (_, i) => i)
    const inRange = (h: number) => rangeStart !== null && rangeEnd !== null && h >= rangeStart && h <= rangeEnd

    function removeZone(id: string) { setActiveIds(ids => ids.filter(i => i !== id)) }
    function addZone(id: string) { setActiveIds(ids => [...ids, id]); setShowAdd(false); setSearch('') }
    function shiftDay(delta: number) { const d = new Date(selectedDate); d.setDate(d.getDate() + delta); setSelectedDate(d) }

    function reorderZones(from: number, to: number) {
        if (from === to) return
        setActiveIds(ids => {
            const next = [...ids]
            const [moved] = next.splice(from, 1)
            next.splice(to, 0, moved)
            return next
        })
    }

    // Drag handlers
    function onDragStart(idx: number, e: React.DragEvent) {
        dragIdxRef.current = idx
        setDraggingIdx(idx)
        e.dataTransfer.effectAllowed = 'move'
        // Invisible ghost so we control the visual ourselves
        const ghost = document.createElement('div')
        ghost.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;'
        document.body.appendChild(ghost)
        e.dataTransfer.setDragImage(ghost, 0, 0)
        requestAnimationFrame(() => document.body.removeChild(ghost))
    }
    function onDragOver(idx: number, e: React.DragEvent) {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (dragIdxRef.current !== null && idx !== dropIdx) setDropIdx(idx)
    }
    function onDrop(idx: number, e: React.DragEvent) {
        e.preventDefault()
        if (dragIdxRef.current !== null) reorderZones(dragIdxRef.current, idx)
        dragIdxRef.current = null
        setDraggingIdx(null)
        setDropIdx(null)
    }
    function onDragEnd() {
        dragIdxRef.current = null
        setDraggingIdx(null)
        setDropIdx(null)
    }

    return (
        <div className="flex flex-col bg-transparent text-white" style={{ height: 'calc(100vh - 4rem)', minHeight: 600 }}>

            {/* TOP BAR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 pt-8 pb-4 shrink-0">
                <div>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-1">World Clock</p>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
                        <Clock size={20} className="text-zinc-500" />
                        Time
                    </h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {/* 12/24 toggle */}
                    <button onClick={() => setFmt12(f => !f)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition-all">
                        {fmt12 ? '12h' : '24h'}
                    </button>

                    {/* Day nav + calendar */}
                    <div className="relative flex items-center gap-1 border border-white/10 rounded-lg bg-white/4 px-1 py-1" ref={calRef}>
                        <button onClick={() => shiftDay(-1)} className="p-1 rounded hover:bg-white/8 text-zinc-400 hover:text-white transition-colors"><ChevronLeft size={14} /></button>
                        <button onClick={() => setShowCal(s => !s)}
                            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium transition-all ${showCal ? 'bg-white/10 text-white' : 'text-zinc-300 hover:text-white'}`}>
                            <Calendar size={11} className="text-zinc-500" />
                            {dayLabel}
                        </button>
                        <button onClick={() => shiftDay(1)} className="p-1 rounded hover:bg-white/8 text-zinc-400 hover:text-white transition-colors"><ChevronRight size={14} /></button>
                        {showCal && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl z-50">
                                <MiniCalendar selected={selectedDate} onChange={(d) => { setSelectedDate(d); setShowCal(false) }} />
                            </div>
                        )}
                    </div>

                    {/* Add timezone */}
                    <div className="relative" ref={addRef}>
                        <button onClick={() => setShowAdd(s => !s)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
                            <Plus size={13} />
                            Add timezone
                        </button>
                        {showAdd && (
                            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl z-50 overflow-hidden">
                                <div className="p-2 border-b border-white/6">
                                    <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                                        placeholder="Search city or timezone…"
                                        className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none px-2 py-1" />
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {addableTZs.length === 0
                                        ? <p className="text-xs text-zinc-600 px-4 py-3">No results</p>
                                        : addableTZs.map(tz => (
                                            <button key={tz.id} onClick={() => addZone(tz.id)}
                                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/6 transition-colors text-left">
                                                <span className="text-base">{tz.flag}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-zinc-200 leading-tight truncate">{tz.label}</p>
                                                    <p className="text-[10px] text-zinc-500">{tz.city}</p>
                                                </div>
                                                <span className="text-[10px] text-zinc-500 font-mono shrink-0">{fmtTime(now, tz.id, fmt12)}</span>
                                            </button>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* LEGEND */}
            <div className="flex items-center gap-4 px-6 pb-3 shrink-0 text-[10px] text-zinc-500 font-medium tracking-wide uppercase">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'rgba(16,185,129,0.2)' }} />Work 9–18</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'rgba(63,63,70,0.6)' }} />Off hours</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: 'rgba(24,24,27,0.9)' }} />Night</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400/50 inline-block" />Now</span>
                <span className="flex items-center gap-1.5 text-zinc-700"><GripVertical size={10} />Drag to reorder</span>
            </div>

            {/* GRID */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 min-h-0">
                <div style={{ minWidth: `${24 * 44 + 192}px`, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                    {/* Hour header */}
                    <div className="flex mb-1.5 shrink-0">
                        <div style={{ width: 192 }} className="shrink-0" />
                        {SLOTS.map(h => (
                            <div key={h} style={{ width: 44 }}
                                className={`shrink-0 text-center text-[9px] font-mono transition-colors duration-150 ${hoveredHour === h ? 'text-white' : inRange(h) ? 'text-blue-300' : 'text-zinc-600'}`}>
                                {hourLabel(h, fmt12)}
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="flex-1 flex flex-col justify-evenly min-h-0">
                        {activeTZs.map((tz, rowIdx) => {
                            const offset = getUTCOffset(tz.id, dayBase)
                            const currentTime = fmtTime(now, tz.id, fmt12)
                            const localHourFor = (utcH: number) => ((utcH + offset) % 24 + 24) % 24
                            const isDragging = draggingIdx === rowIdx
                            const isDropAbove = dropIdx === rowIdx && dragIdxRef.current !== null && dragIdxRef.current > rowIdx
                            const isDropBelow = dropIdx === rowIdx && dragIdxRef.current !== null && dragIdxRef.current < rowIdx

                            return (
                                <div
                                    key={tz.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(rowIdx, e)}
                                    onDragOver={(e) => onDragOver(rowIdx, e)}
                                    onDrop={(e) => onDrop(rowIdx, e)}
                                    onDragEnd={onDragEnd}
                                    className="flex items-center group shrink-0 rounded-sm relative"
                                    style={{
                                        height: 40,
                                        opacity: isDragging ? 0.3 : 1,
                                        transition: 'opacity 0.1s',
                                        cursor: 'grab',
                                        borderTop: isDropAbove ? '2px solid rgba(96,165,250,0.7)' : '2px solid transparent',
                                        borderBottom: isDropBelow ? '2px solid rgba(96,165,250,0.7)' : '2px solid transparent',
                                    }}
                                >
                                    {/* Label + drag handle */}
                                    <div style={{ width: 192 }} className="shrink-0 flex items-center gap-1.5 pr-3">
                                        <GripVertical
                                            size={13}
                                            className="shrink-0 text-zinc-700 group-hover:text-zinc-500 transition-colors"
                                            style={{ cursor: 'grab' }}
                                        />
                                        <span className="text-lg leading-none select-none">{tz.flag}</span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold text-zinc-100 leading-none truncate">{tz.label}</p>
                                            <p className="text-[9px] text-zinc-500 mt-0.5 font-mono leading-none">{currentTime}</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeZone(tz.id) }}
                                            className="shrink-0 w-4 h-4 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 text-zinc-500 hover:text-white transition-all"
                                        >
                                            <X size={9} />
                                        </button>
                                    </div>

                                    {/* Hour slots */}
                                    {SLOTS.map(utcH => {
                                        const lh = Math.floor(localHourFor(utcH))
                                        const isNowSlot = isToday && utcH === nowHourUTC
                                        const isHov = hoveredHour === utcH
                                        const isRangeSlot = inRange(utcH)
                                        const isEdge = utcH === rangeStart || utcH === rangeEnd
                                        const { bg, text } = slotColor(lh)
                                        return (
                                            <div
                                                key={utcH}
                                                style={{
                                                    width: 44, height: 36,
                                                    background: isEdge ? 'rgba(96,165,250,0.35)'
                                                        : isRangeSlot ? 'rgba(96,165,250,0.15)'
                                                            : isHov ? 'rgba(255,255,255,0.10)'
                                                                : bg,
                                                    color: isRangeSlot ? '#93c5fd' : isHov ? '#fff' : text,
                                                    outline: isNowSlot ? '2px solid rgba(96,165,250,0.55)' : 'none',
                                                    outlineOffset: '-2px',
                                                    cursor: 'grab',
                                                }}
                                                className="shrink-0 relative flex items-center justify-center rounded-sm mx-px select-none"
                                                onMouseEnter={() => handleHoverEnter(utcH)}
                                                onMouseLeave={handleHoverLeave}
                                            >
                                                <span className="text-[10px] font-mono leading-none">{hourLabel(lh, fmt12)}</span>
                                                {isNowSlot && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>

                    {/* UTC axis */}
                    <div className="flex mt-2 shrink-0">
                        <div style={{ width: 192 }} className="shrink-0 text-[9px] text-zinc-700 font-mono pr-3 text-right self-center">UTC</div>
                        {SLOTS.map(h => (
                            <div key={h} style={{ width: 44 }}
                                className={`shrink-0 text-center text-[9px] font-mono transition-colors duration-150 ${hoveredHour === h ? 'text-zinc-300' : inRange(h) ? 'text-blue-400/60' : 'text-zinc-700'}`}>
                                {String(h).padStart(2, '0')}
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* TIME RANGE BAR */}
            <div className="shrink-0 px-6">
                <TimeRangeBar
                    rangeStart={rangeStart} rangeEnd={rangeEnd}
                    onRangeChange={(s, e) => { setRangeStart(s); setRangeEnd(e) }}
                    hoveredHour={hoveredHour} fmt={fmt12}
                />
            </div>

            {/* DETAIL STRIP */}
            <div className="shrink-0 px-6 pb-4">
                {hoveredHour !== null ? (
                    <div className="rounded-xl border border-white/8 bg-white/4 px-4 py-3 flex flex-wrap gap-4">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 self-center mr-1">UTC {String(hoveredHour).padStart(2, '0')}:00</span>
                        {activeTZs.map(tz => {
                            const sd = new Date(dayBase.getTime() + hoveredHour * 3600000)
                            return (
                                <div key={tz.id} className="flex items-center gap-1.5">
                                    <span className="text-sm">{tz.flag}</span>
                                    <div>
                                        <p className="text-[11px] font-semibold text-zinc-200 leading-none">{tz.label}</p>
                                        <p className="text-[10px] font-mono text-zinc-500 leading-none mt-0.5">
                                            {fmtTime(sd, tz.id, fmt12)} · {fmtDate(sd, tz.id)}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : rangeStart !== null && rangeEnd !== null ? (
                    <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 px-4 py-3 flex flex-wrap gap-4">
                        <span className="text-[10px] uppercase tracking-widest text-blue-400/70 self-center mr-1">
                            Range UTC {String(rangeStart).padStart(2, '0')}–{String(Math.min(rangeEnd + 1, 23)).padStart(2, '0')}
                        </span>
                        {activeTZs.map(tz => {
                            const sd = new Date(dayBase.getTime() + rangeStart * 3600000)
                            const ed = new Date(dayBase.getTime() + (rangeEnd + 1) * 3600000)
                            return (
                                <div key={tz.id} className="flex items-center gap-1.5">
                                    <span className="text-sm">{tz.flag}</span>
                                    <div>
                                        <p className="text-[11px] font-semibold text-zinc-200 leading-none">{tz.label}</p>
                                        <p className="text-[10px] font-mono text-blue-300/80 leading-none mt-0.5">{fmtTime(sd, tz.id, fmt12)} – {fmtTime(ed, tz.id, fmt12)}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : <div className="h-14" />}
            </div>

        </div>
    )
}