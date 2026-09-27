import { Fragment, type ReactNode } from "react"

/**
 * Tiny Markdown renderer for journal entries — headings, paragraphs, lists,
 * blockquotes, images, **bold**, *italic*, `code` and [links](url).
 * Server-rendered, so the text is plain HTML for search engines.
 */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const t = m[0]
    const k = `${keyBase}-${i++}`
    if (t.startsWith("**")) out.push(<strong key={k}>{t.slice(2, -2)}</strong>)
    else if (t.startsWith("`")) out.push(<code key={k}>{t.slice(1, -1)}</code>)
    else if (t.startsWith("[")) {
      const [, label, href] = t.match(/\[([^\]]+)\]\(([^)]+)\)/)!
      const ext = /^https?:/.test(href)
      out.push(
        <a key={k} href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {label}
        </a>
      )
    } else out.push(<em key={k}>{t.slice(1, -1)}</em>)
    last = m.index + t.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = source.trim().split(/\n\s*\n/)
  return (
    <div className={className}>
      {blocks.map((block, bi) => {
        const b = block.trim()
        const k = `b${bi}`
        if (b.startsWith("### ")) return <h3 key={k}>{inline(b.slice(4), k)}</h3>
        if (b.startsWith("## ")) return <h2 key={k}>{inline(b.slice(3), k)}</h2>
        if (b.startsWith("> ")) return <blockquote key={k}>{inline(b.replace(/^> ?/gm, ""), k)}</blockquote>
        const img = b.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
        if (img)
          return (
            <figure key={k}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img[2]} alt={img[1]} loading="lazy" className="rounded-2xl" />
              {img[1] && <figcaption>{img[1]}</figcaption>}
            </figure>
          )
        const lines = b.split("\n")
        if (lines.every((l) => /^\s*[-*] /.test(l)))
          return (
            <ul key={k}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*[-*] /, ""), `${k}-${li}`)}</li>
              ))}
            </ul>
          )
        if (lines.every((l) => /^\s*\d+\. /.test(l)))
          return (
            <ol key={k}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*\d+\. /, ""), `${k}-${li}`)}</li>
              ))}
            </ol>
          )
        return (
          <p key={k}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, `${k}-${li}`)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
