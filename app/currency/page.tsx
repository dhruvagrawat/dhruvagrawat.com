'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeftRight, Plus, X, Percent, RefreshCw, ChevronDown } from 'lucide-react'

/* ═══════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════ */
const API_KEY = '847bffe2231a058e954b5247'
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`

const POPULAR_CURRENCIES = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰', symbol: 'HK$' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷', symbol: '₩' },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽', symbol: '$' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺', symbol: '₽' },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺' },
    { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰', symbol: 'kr' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿', symbol: 'NZ$' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦', symbol: 'R' },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' },
    { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾', symbol: 'RM' },
    { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭', symbol: '₱' },
    { code: 'PKR', name: 'Pakistani Rupee', flag: '🇵🇰', symbol: '₨' },
    { code: 'BDT', name: 'Bangladeshi Taka', flag: '🇧🇩', symbol: '৳' },
    { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬', symbol: 'E£' },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', symbol: '﷼' },
    { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦', symbol: '﷼' },
    { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼', symbol: 'KD' },
    { code: 'BHD', name: 'Bahraini Dinar', flag: '🇧🇭', symbol: 'BD' },
    { code: 'OMR', name: 'Omani Rial', flag: '🇴🇲', symbol: '﷼' },
    { code: 'ILS', name: 'Israeli Shekel', flag: '🇮🇱', symbol: '₪' },
    { code: 'PLN', name: 'Polish Złoty', flag: '🇵🇱', symbol: 'zł' },
    { code: 'CZK', name: 'Czech Koruna', flag: '🇨🇿', symbol: 'Kč' },
    { code: 'HUF', name: 'Hungarian Forint', flag: '🇭🇺', symbol: 'Ft' },
    { code: 'RON', name: 'Romanian Leu', flag: '🇷🇴', symbol: 'lei' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', flag: '🇺🇦', symbol: '₴' },
    { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬', symbol: '₦' },
    { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪', symbol: 'KSh' },
    { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭', symbol: '₵' },
    { code: 'CLP', name: 'Chilean Peso', flag: '🇨🇱', symbol: '$' },
    { code: 'COP', name: 'Colombian Peso', flag: '🇨🇴', symbol: '$' },
    { code: 'ARS', name: 'Argentine Peso', flag: '🇦🇷', symbol: '$' },
    { code: 'PEN', name: 'Peruvian Sol', flag: '🇵🇪', symbol: 'S/' },
    { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳', symbol: '₫' },
    { code: 'LKR', name: 'Sri Lankan Rupee', flag: '🇱🇰', symbol: '₨' },
    { code: 'NPR', name: 'Nepalese Rupee', flag: '🇳🇵', symbol: '₨' },
]

const PERCENT_PRESETS = [10, 25, 30, 50, 70]
const DEFAULT_PAIRS: [string, string][] = [['USD', 'INR'], ['USD', 'AED'], ['USD', 'GBP']]

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function getCurrency(code: string) {
    return POPULAR_CURRENCIES.find(c => c.code === code) ?? { code, name: code, flag: '🏳️', symbol: code }
}

function fmtAmount(n: number, decimals = 2): string {
    if (n >= 1000000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
    if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
    return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

/* ═══════════════════════════════════════════
   CURRENCY PICKER DROPDOWN
═══════════════════════════════════════════ */
function CurrencyPicker({
    value, onChange, exclude = []
}: { value: string; onChange: (c: string) => void; exclude?: string[] }) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const ref = useRef<HTMLDivElement>(null)
    const cur = getCurrency(value)

    useEffect(() => {
        function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setSearch('') } }
        document.addEventListener('mousedown', h)
        return () => document.removeEventListener('mousedown', h)
    }, [])

    const filtered = POPULAR_CURRENCIES.filter(c =>
        !exclude.includes(c.code) &&
        (c.code.toLowerCase().includes(search.toLowerCase()) ||
            c.name.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all min-w-[120px]"
            >
                <span className="text-lg leading-none">{cur.flag}</span>
                <div className="text-left flex-1">
                    <p className="text-sm font-bold text-zinc-100 leading-none">{cur.code}</p>
                    <p className="text-[9px] text-zinc-500 leading-none mt-0.5 truncate max-w-[70px]">{cur.name}</p>
                </div>
                <ChevronDown size={12} className={`text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl z-50 overflow-hidden">
                    <div className="p-2 border-b border-white/6">
                        <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search currency…"
                            className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none px-2 py-1" />
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                        {filtered.map(c => (
                            <button key={c.code} onClick={() => { onChange(c.code); setOpen(false); setSearch('') }}
                                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-white/6 transition-colors text-left ${c.code === value ? 'bg-white/8' : ''}`}>
                                <span className="text-base">{c.flag}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-zinc-200 leading-none">{c.code}</p>
                                    <p className="text-[10px] text-zinc-500 truncate">{c.name}</p>
                                </div>
                                <span className="text-[10px] text-zinc-600 font-mono">{c.symbol}</span>
                            </button>
                        ))}
                        {filtered.length === 0 && <p className="text-xs text-zinc-600 px-4 py-3">No results</p>}
                    </div>
                </div>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════
   PERCENTAGE PANEL
═══════════════════════════════════════════ */
function PercentPanel({
    amount, onApply
}: { amount: number; onApply: (val: number) => void }) {
    const [custom, setCustom] = useState('')
    const [active, setActive] = useState<number | null>(null)

    function apply(pct: number) {
        setActive(pct)
        onApply((amount * pct) / 100)
    }

    function applyCustom() {
        const n = parseFloat(custom)
        if (!isNaN(n) && n > 0) { setActive(null); onApply((amount * n) / 100) }
    }

    return (
        <div className="mt-2 p-3 rounded-xl border border-white/8 bg-white/3 space-y-2.5">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">% of {fmtAmount(amount)}</p>
            <div className="flex flex-wrap gap-1.5">
                {PERCENT_PRESETS.map(p => (
                    <button key={p} onClick={() => apply(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
              ${active === p
                                ? 'bg-white text-black border-white'
                                : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white'}`}>
                        {p}%
                    </button>
                ))}
                {/* Custom input */}
                <div className="flex items-center gap-1">
                    <input
                        value={custom}
                        onChange={e => { setCustom(e.target.value); setActive(null) }}
                        onKeyDown={e => e.key === 'Enter' && applyCustom()}
                        placeholder="Custom %"
                        type="number"
                        min="0" max="100"
                        className="w-24 px-2 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-white/25 transition-colors"
                    />
                    <button onClick={applyCustom}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                        Apply
                    </button>
                </div>
            </div>
            {/* Result row */}
            {active !== null && (
                <p className="text-[11px] text-zinc-400 font-mono">
                    {active}% = <span className="text-zinc-200 font-semibold">{fmtAmount((amount * active) / 100)}</span>
                </p>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════
   SINGLE CONVERTER CARD
═══════════════════════════════════════════ */
function ConverterRow({
    from, to, rates, amount, onFromChange, onToChange, onRemove, showRemove,
}: {
    from: string; to: string; rates: Record<string, number> | null
    amount: number; onFromChange: (c: string) => void; onToChange: (c: string) => void
    onRemove: () => void; showRemove: boolean
}) {
    const [showPct, setShowPct] = useState(false)
    const [pctAmount, setPctAmount] = useState<number | null>(null)

    const fromRate = rates?.[from] ?? 1
    const toRate = rates?.[to] ?? 1
    const rate = toRate / fromRate
    const converted = amount * rate
    const pctConverted = pctAmount !== null ? pctAmount * rate : null

    function swap() { onFromChange(to); onToChange(from) }

    return (
        <div className="rounded-xl border border-white/8 bg-white/4 backdrop-blur-sm overflow-hidden">
            <div className="p-4 space-y-3">

                {/* Pickers row */}
                <div className="flex items-center gap-2">
                    <CurrencyPicker value={from} onChange={onFromChange} exclude={[to]} />
                    <button onClick={swap}
                        className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all flex-shrink-0">
                        <ArrowLeftRight size={13} />
                    </button>
                    <CurrencyPicker value={to} onChange={onToChange} exclude={[from]} />
                    {showRemove && (
                        <button onClick={onRemove}
                            className="ml-auto p-1.5 rounded-lg text-zinc-700 hover:text-zinc-300 hover:bg-white/8 transition-all flex-shrink-0">
                            <X size={12} />
                        </button>
                    )}
                </div>

                {/* Result + % button */}
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1">
                            {getCurrency(from).flag} {fmtAmount(amount)} {from}
                        </p>
                        <p className="text-2xl font-bold text-zinc-100 leading-none font-mono">
                            {getCurrency(to).symbol}&nbsp;{rates ? fmtAmount(converted) : '—'}
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-1 font-mono">
                            {rates ? `1 ${from} = ${fmtAmount(rate, 4)} ${to}` : 'Loading…'}
                        </p>
                    </div>
                    <button
                        onClick={() => { setShowPct(s => !s); setPctAmount(null) }}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex-shrink-0
              ${showPct
                                ? 'bg-white/10 border-white/20 text-white'
                                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'}`}>
                        <Percent size={11} />%
                    </button>
                </div>

                {/* Percent panel */}
                {showPct && (
                    <PercentPanel amount={amount} onApply={(val) => setPctAmount(val)} />
                )}
                {showPct && pctAmount !== null && rates && (
                    <div className="flex items-center gap-2 pt-1 border-t border-white/6">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wide">% →</span>
                        <span className="text-sm font-bold font-mono text-emerald-400">
                            {getCurrency(to).symbol} {fmtAmount(pctConverted!)}
                        </span>
                        <span className="text-[10px] text-zinc-600 font-mono">({fmtAmount(pctAmount)} {from})</span>
                    </div>
                )}
            </div>

            {/* Rate bar */}
            {rates && (
                <div className="px-4 pb-3">
                    <div className="flex items-center gap-2 text-[9px] text-zinc-700 font-mono">
                        <span>{from}</span>
                        <div className="flex-1 h-0.5 rounded-full bg-white/6 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500/50 to-emerald-400/20"
                                style={{ width: `${Math.min((1 / rate) * 50, 100)}%` }} />
                        </div>
                        <span>{to}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function Page() {
    const [rates, setRates] = useState<Record<string, number> | null>(null)
    const [lastUpdated, setLast] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [amount, setAmount] = useState<string>('1000')
    const [pairs, setPairs] = useState<[string, string][]>(DEFAULT_PAIRS)
    const [refreshing, setRefresh] = useState(false)

    async function fetchRates() {
        try {
            setRefresh(true)
            const res = await fetch(API_URL)
            const data = await res.json()
            if (data.result === 'success') {
                setRates(data.conversion_rates)
                setLast(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
                setError(false)
            } else { setError(true) }
        } catch { setError(true) }
        finally { setLoading(false); setRefresh(false) }
    }

    useEffect(() => { fetchRates() }, [])

    const numAmount = parseFloat(amount) || 0

    function addPair() {
        if (pairs.length >= 3) return
        // Pick a currency not already in pairs
        const used = new Set(pairs.flat())
        const next = POPULAR_CURRENCIES.find(c => !used.has(c.code))
        if (next) setPairs(p => [...p, ['USD', next.code]])
    }

    function removePair(i: number) {
        setPairs(p => p.filter((_, idx) => idx !== i))
    }

    function updatePair(i: number, side: 0 | 1, code: string) {
        setPairs(p => p.map((pair, idx) => idx === i ? (side === 0 ? [code, pair[1]] : [pair[0], code]) : pair))
    }

    return (
        <div className="min-h-screen bg-transparent text-white px-4 py-14">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-2">Live Rates</p>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <ArrowLeftRight size={24} className="text-zinc-500" />
                            Currency
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            {loading ? (
                                <span className="text-xs text-zinc-600">Fetching rates…</span>
                            ) : error ? (
                                <span className="text-xs text-red-400">Failed to load rates</span>
                            ) : (
                                <span className="text-xs text-zinc-500">Updated {lastUpdated}</span>
                            )}
                            <button onClick={fetchRates} disabled={refreshing}
                                className="p-1 rounded hover:bg-white/8 text-zinc-600 hover:text-zinc-300 transition-all">
                                <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>

                    {/* Amount input */}
                    <div className="flex flex-col gap-1">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Amount</p>
                        <input
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            type="number"
                            min="0"
                            placeholder="1000"
                            className="w-48 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-lg font-bold font-mono text-zinc-100 placeholder-zinc-600 outline-none focus:border-white/25 transition-colors text-right"
                        />
                    </div>
                </div>

                {/* Converter cards — 1 col mobile, 2 col md, 3 col xl */}
                <div className={`grid gap-2.5 ${pairs.length === 1 ? 'grid-cols-1' : pairs.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
                    {pairs.map((pair, i) => (
                        <ConverterRow
                            key={i}
                            from={pair[0]}
                            to={pair[1]}
                            rates={rates}
                            amount={numAmount}
                            onFromChange={(c) => updatePair(i, 0, c)}
                            onToChange={(c) => updatePair(i, 1, c)}
                            onRemove={() => removePair(i)}
                            showRemove={pairs.length > 1}
                        />
                    ))}
                </div>

                {/* Add comparison */}
                {pairs.length < 3 && (
                    <button onClick={addPair}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/10 text-xs font-medium text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition-all">
                        <Plus size={13} />
                        Add comparison ({pairs.length}/3)
                    </button>
                )}

                {/* Quick reference table */}
                {rates && (
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-500 whitespace-nowrap">Quick Reference</p>
                            <div className="flex-1 h-px bg-white/6" />
                        </div>
                        {/* Grid: 2 columns on md+, 1 on mobile */}
                        <div className="grid md:grid-cols-2 gap-2">
                            {['EUR', 'GBP', 'INR', 'AED', 'JPY', 'AUD', 'CAD', 'SGD', 'CHF', 'CNY'].map(code => {
                                const cur = getCurrency(code)
                                const rate = (rates[code] ?? 1) / (rates['USD'] ?? 1)
                                const val = numAmount > 0 ? numAmount * rate : rate
                                return (
                                    <div key={code}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/8 bg-white/4 hover:bg-white/6 transition-colors">
                                        {/* Flag + code */}
                                        <span className="text-xl leading-none flex-shrink-0">{cur.flag}</span>
                                        <div className="w-16 flex-shrink-0">
                                            <p className="text-sm font-bold text-zinc-100 leading-none">{code}</p>
                                            <p className="text-[9px] text-zinc-600 leading-none mt-0.5 truncate">{cur.name}</p>
                                        </div>
                                        {/* Rate bar */}
                                        <div className="flex-1 h-1 rounded-full bg-white/6 overflow-hidden mx-1">
                                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500/50 to-emerald-400/20"
                                                style={{ width: `${Math.min((rate / 100) * 100, 100)}%` }} />
                                        </div>
                                        {/* Values */}
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-bold font-mono text-zinc-100 leading-none">
                                                {cur.symbol} {fmtAmount(val)}
                                            </p>
                                            <p className="text-[9px] font-mono text-zinc-600 leading-none mt-0.5">
                                                1 USD = {fmtAmount(rate, 4)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}