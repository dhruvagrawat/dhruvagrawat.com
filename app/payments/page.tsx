'use client'

import { useState } from 'react'
import { ChevronDown, Copy, Check, Share2, ExternalLink } from 'lucide-react'

/* ─────────────────────────────────────────
   COPY FIELD
───────────────────────────────────────── */
function CopyField({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false)
    return (
        <div className="flex items-center justify-between bg-black/20 border border-white/8 px-3 py-2.5 rounded-lg">
            <div className="min-w-0 mr-2">
                <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-500 mb-0.5">{label}</p>
                <p className="text-sm text-zinc-200 font-mono break-all leading-snug">{value}</p>
            </div>
            <button
                onClick={async (e) => {
                    e.stopPropagation()
                    await navigator.clipboard.writeText(value)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1500)
                }}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md bg-white/8 hover:bg-white/15 transition-colors text-zinc-400 hover:text-white"
            >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
        </div>
    )
}

/* ─────────────────────────────────────────
   SHARE BUTTON
───────────────────────────────────────── */
function ShareBtn({ text, stopProp = false }: { text: string; stopProp?: boolean }) {
    const [copied, setCopied] = useState(false)
    return (
        <button
            onClick={(e) => {
                if (stopProp) e.stopPropagation()
                navigator.clipboard.writeText(text.trim())
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                ${copied
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
        >
            {copied ? <Check size={12} /> : <Share2 size={12} />}
            {copied ? 'Copied!' : 'Share'}
        </button>
    )
}

/* ─────────────────────────────────────────
   OPEN LINK BUTTON
───────────────────────────────────────── */
function OpenBtn({ href }: { href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
        >
            <ExternalLink size={12} />
            Open
        </a>
    )
}

/* ─────────────────────────────────────────
   RECOMMENDED BADGE
───────────────────────────────────────── */
function RecommendedBadge() {
    return (
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 tracking-wide uppercase">
            ★ Recommended
        </span>
    )
}

/* ─────────────────────────────────────────
   QR DISPLAY
───────────────────────────────────────── */
function QRBlock({ src }: { src: string }) {
    return (
        <div className="flex justify-center py-2">
            <div className="bg-white p-2 rounded-xl inline-block">
                <img src={src} alt="QR Code" className="w-44 h-44 object-contain rounded-lg" />
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────
   COLLAPSIBLE CARD
   self-start = card never stretches to match sibling height
───────────────────────────────────────── */
function PayCard({
    logo,
    name,
    badge,
    recommended,
    inactive,
    shareText,
    openHref,
    children,
}: {
    logo: string
    name: string
    badge?: string
    recommended?: boolean
    inactive?: boolean
    shareText: string
    openHref?: string
    children?: React.ReactNode
}) {
    const [open, setOpen] = useState(false)

    return (
        <div className="self-start rounded-xl border border-white/8 bg-white/4 backdrop-blur-sm overflow-hidden">

            {/* Header */}
            <button
                type="button"
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${inactive ? 'cursor-default' : 'hover:bg-white/4 transition-colors'}`}
                onClick={() => !inactive && setOpen(o => !o)}
            >
                {/* Logo */}
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0">
                    <img src={logo} alt={name} className="w-8 h-8 object-contain" />
                </div>

                {/* Name + badges */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-zinc-100 leading-tight">{name}</p>
                        {recommended && <RecommendedBadge />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {badge && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/8 text-zinc-400">
                                {badge}
                            </span>
                        )}
                        {inactive && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-900/40 text-red-400">
                                Inactive
                            </span>
                        )}
                    </div>
                </div>

                {/* Collapsed: show action buttons inline */}
                {!open && (
                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {openHref && <OpenBtn href={openHref} />}
                        <ShareBtn text={shareText} stopProp />
                    </div>
                )}

                {!inactive && (
                    <ChevronDown
                        size={15}
                        className={`text-zinc-600 transition-transform duration-200 shrink-0 ml-1 ${open ? 'rotate-180' : ''}`}
                    />
                )}
            </button>

            {/* Expanded body */}
            {open && (
                <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-white/6">
                    <div className="h-1" />
                    {children}
                    <div className="flex items-center gap-2 pt-1.5">
                        {openHref && <OpenBtn href={openHref} />}
                        <ShareBtn text={shareText} />
                    </div>
                </div>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════
   GLOBAL CARDS
═══════════════════════════════════════════ */

function WiseCard() {
    return (
        <PayCard
            logo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWHA_A4OzmbA3zAo3r908So-vG-6U4us_Qew&s"
            name="Wise"
            badge="International"
            inactive
        // openHref="https://wise.com/pay/me/dhruvx"
        // shareText={`Wise Payment Details\nTag: @dhruvx\nLink: https://wise.com/pay/me/dhruvx`}
        >
            <QRBlock src="/payments/wise.png" />
            <CopyField label="Wise Tag" value="@dhruvx" />
            <CopyField label="Payment Link" value="https://wise.com/pay/me/dhruvx" />
        </PayCard>
    )
}

function InfinityUSDCard() {
    return (
        <PayCard
            logo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKiHklsWhw7wHC9wC1_xNviL_BKUzTsABTuA&s"
            name="Infinity · USD ACH"
            badge="JPMorgan Chase"
            openHref="https://hub.infinityapp.in/payment-detail/ZMQgXmcQ2A-mOjZ6jkc7"
            shareText={`USD Bank Transfer (via InfinityApp)\nBeneficiary Name: DHRUV\nAccount Number: 20000045885960\nRouting Number: 028000024\nBank Name: JPMorgan Chase & Co.\nBeneficiary Address: 383 Madison Ave, New York, NY 10179, USA\nAccount Type: Business Checking\nLink: https://hub.infinityapp.in/payment-detail/ZMQgXmcQ2A-mOjZ6jkc7`}
        >
            <CopyField label="Beneficiary Name" value="DHRUV" />
            <CopyField label="Account Number" value="20000045885960" />
            <CopyField label="Routing Number" value="028000024" />
            <CopyField label="Bank Name" value="JPMorgan Chase & Co." />
            <CopyField label="Beneficiary Address" value="383 Madison Ave, New York, NY 10179, USA" />
            <CopyField label="Account Type" value="Business Checking" />
        </PayCard>
    )
}

function InfinitySwiftCard() {
    return (
        <PayCard
            logo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKiHklsWhw7wHC9wC1_xNviL_BKUzTsABTuA&s"
            name="Infinity · SWIFT Wire"
            badge="JPMorgan Chase"
            shareText={`SWIFT / Wire Transfer (via InfinityApp)\nBeneficiary Name: DHRUV\nAccount Number: 20000045885960\nSWIFT/BIC Code: CHASUS33XXX\nBank Name: JPMorgan Chase & Co.\nBeneficiary Address: 383 Madison Ave, New York, NY 10179, USA\nAccount Type: Business Checking`}
        >
            <CopyField label="Beneficiary Name" value="DHRUV" />
            <CopyField label="Account Number" value="20000045885960" />
            <CopyField label="SWIFT / BIC Code" value="CHASUS33XXX" />
            <CopyField label="Bank Name" value="JPMorgan Chase & Co." />
            <CopyField label="Beneficiary Address" value="383 Madison Ave, New York, NY 10179, USA" />
            <CopyField label="Account Type" value="Business Checking" />
        </PayCard>
    )
}

function PaypalCard() {
    return (
        <PayCard
            logo="https://upload.wikimedia.org/wikipedia/commons/b/b7/PayPal_Logo_Icon_2014.svg"
            name="PayPal"
            badge="paypal.me/quadcydle"
            inactive
            openHref="https://paypal.me/quadcydle"
            shareText={`PayPal\nLink: https://paypal.me/quadcydle`}
        />
    )
}

/* ═══════════════════════════════════════════
   INDIAN BANK CARDS
   Official names sourced from RBI / bank websites
   • Slice Small Finance Bank Limited
   • Kotak Mahindra Bank Limited
   • SBM Bank (India) Ltd. — subsidiary of State Bank of Mauritius
   • Airtel Payments Bank Limited
═══════════════════════════════════════════ */

function SliceBankCard() {
    return (
        <PayCard
            logo="https://upload.wikimedia.org/wikipedia/en/3/3b/Slice_Small_Finance_Bank.png"
            name="Slice Small Finance Bank Limited"
            recommended
            shareText={`Slice Small Finance Bank Limited\nAccount Holder: Mr Dhruv\nAccount Number: 033325221405891\nIFSC Code: NESF0000096\nAlt IFSC Code: NESF0000333`}
        >
            <CopyField label="Account Holder" value="Mr Dhruv" />
            <CopyField label="Account Number" value="033325221405891" />
            <CopyField label="IFSC Code" value="NESF0000096" />
            <CopyField label="Alt IFSC Code" value="NESF0000333" />
        </PayCard>
    )
}

function KotakBankCard() {
    return (
        <PayCard
            logo="https://www.logoshape.com/wp-content/uploads/2024/08/kotak-mahindra-bank-logo-vector_logoshape.png"
            name="Kotak Mahindra Bank Limited"
            shareText={`Kotak Mahindra Bank Limited\nAccount Holder: Dhruv\nAccount Number: 1948193441\nIFSC Code: KKBK0000204`}
        >
            <CopyField label="Account Holder" value="Dhruv" />
            <CopyField label="Account Number" value="1948193441" />
            <CopyField label="IFSC Code" value="KKBK0000204" />
        </PayCard>
    )
}

function SbmBankCard() {
    return (
        <PayCard
            logo="https://upload.wikimedia.org/wikipedia/commons/2/22/State_Bank_of_Mauritius_Logo.jpg"
            name="SBM Bank (India) Ltd."
            badge="State Bank of Mauritius"
            shareText={`SBM Bank (India) Ltd.\nAccount Holder: Dhruv.\nAccount Number: 20012420274545\nIFSC Code: STCB0000065`}
        >
            <CopyField label="Account Holder" value="Dhruv." />
            <CopyField label="Account Number" value="20012420274545" />
            <CopyField label="IFSC Code" value="STCB0000065" />
        </PayCard>
    )
}

function AirtelBankCard() {
    return (
        <PayCard
            logo="https://i.pinimg.com/736x/93/51/94/9351948a8a7aa49c7a7b54ce92c4012b.jpg"
            name="Airtel Payments Bank Limited"
            shareText={`Airtel Payments Bank Limited\nAccount Holder: Dhruv\nAccount Number: 9205252966\nIFSC Code: AIRP0000001`}
        >
            <CopyField label="Account Holder" value="Dhruv" />
            <CopyField label="Account Number" value="9205252966" />
            <CopyField label="IFSC Code" value="AIRP0000001" />
        </PayCard>
    )
}

/* ═══════════════════════════════════════════
   UPI CARDS
═══════════════════════════════════════════ */

function PaytmCard() {
    return (
        <PayCard
            logo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO6mX_lOFFvci63oaLCwtCUPobgbZTJTeLlQ&s"
            name="Paytm"
            badge="UPI"
            recommended
            shareText={`Paytm UPI\nUPI ID: 9205252966@ptsbi`}
        >
            <QRBlock src="/payments/paytm.jpeg" />
            <CopyField label="UPI ID" value="9205252966@ptsbi" />
        </PayCard>
    )
}

function PhonepeCard() {
    return (
        <PayCard
            logo="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo4x8kSTmPUq4PFzl4HNT0gObFuEhivHOFYg&s"
            name="PhonePe"
            badge="UPI"
            shareText={`PhonePe UPI\nUPI ID: 9205252966@ybl`}
        >
            <QRBlock src="/payments/phonepe.png" />
            <CopyField label="UPI ID" value="9205252966@ybl" />
        </PayCard>
    )
}

function GpayCard() {
    return (
        <PayCard
            logo="https://img.icons8.com/color/512/google-pay.png"
            name="Google Pay"
            badge="UPI"
            shareText={`Google Pay UPI\nUPI ID: dhruvagrawat9-4@oksbi`}
        >
            <QRBlock src="/payments/google.png" />
            <CopyField label="UPI ID" value="dhruvagrawat9-4@oksbi" />
        </PayCard>
    )
}

/* ─────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────── */
function SectionHeader({ label, count }: { label: string; count: number }) {
    return (
        <div className="flex items-center gap-3 mb-3">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-500 whitespace-nowrap">{label}</p>
            <span className="text-[10px] px-1.5 py-0.5 bg-white/6 text-zinc-500 rounded-full font-mono">{count}</span>
            <div className="flex-1 h-px bg-white/6" />
        </div>
    )
}

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function Page() {
    return (
        <div className="min-h-screen bg-transparent text-white px-4 py-14">
            <div className="max-w-5xl mx-auto space-y-14">

                <div>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-2">Payment Details</p>
                    <h1 className="text-3xl font-bold tracking-tight">Receiving Payments</h1>
                    <p className="text-sm text-zinc-500 mt-2">Tap any card to expand. Share copies all details instantly.</p>
                </div>

                <div>
                    <SectionHeader label="Global Payments" count={4} />
                    <div className="grid md:grid-cols-2 gap-3 items-start">

                        <InfinityUSDCard />
                        <InfinitySwiftCard />
                        <PaypalCard />
                        <WiseCard />
                    </div>
                </div>

                <div>
                    <SectionHeader label="Indian Bank Accounts" count={4} />
                    <div className="grid md:grid-cols-2 gap-3 items-start">
                        <SliceBankCard />
                        <KotakBankCard />
                        <SbmBankCard />
                        <AirtelBankCard />
                    </div>
                </div>

                <div>
                    <SectionHeader label="UPI Payments" count={3} />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
                        <PaytmCard />
                        <PhonepeCard />
                        <GpayCard />
                    </div>
                </div>

            </div>
        </div>
    )
}