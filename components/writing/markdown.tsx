import { Fragment, type ReactNode } from "react"
import { CodeBlock } from "./code-block"

/**
 * Markdown renderer for posts, articles and journal entries.
 * Supports: ## / ### headings (with anchor ids), paragraphs, - and 1. lists,
 * > blockquotes, ``` fenced code ```, | tables |, --- rules, ![images](src),
 * **bold**, *italic*, `code` and [links](url).
 * Runs on the server, so everything is plain HTML for search engines.
 */

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[`*_[\]()]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

/** h2 headings, for a table of contents */
export function headingsOf(source: string) {
  const out: { id: string; text: string }[] = []
  let inCode = false
  for (const line of source.split("\n")) {
    if (line.trim().startsWith("```")) inCode = !inCode
    if (!inCode && line.startsWith("## ")) {
      const text = line.slice(3).replace(/[*`]/g, "").trim()
      out.push({ id: slugify(text), text })
    }
  }
  return out
}

export function wordCount(source: string) {
  return source.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length
}

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const t = m[0]
    const k = `${keyBase}-${i++}`
    if (t.startsWith("**")) out.push(<strong key={k}>{inline(t.slice(2, -2), k)}</strong>)
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

type Block =
  | { t: "code"; lang: string; code: string }
  | { t: "text"; text: string }

function splitBlocks(source: string): Block[] {
  const blocks: Block[] = []
  const lines = source.replace(/\r\n/g, "\n").trim().split("\n")
  let buf: string[] = []
  const flush = () => {
    const text = buf.join("\n").trim()
    if (text) text.split(/\n\s*\n/).forEach((t) => blocks.push({ t: "text", text: t.trim() }))
    buf = []
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fence = line.match(/^```(\S*)/)
    if (fence) {
      flush()
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++])
      blocks.push({ t: "code", lang: fence[1] || "", code: code.join("\n") })
      continue
    }
    buf.push(line)
  }
  flush()
  return blocks
}

export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = splitBlocks(source)
  return (
    <div className={className}>
      {blocks.map((blk, bi) => {
        const k = `b${bi}`
        if (blk.t === "code") return <CodeBlock key={k} code={blk.code} lang={blk.lang} />
        const b = blk.text
        if (b === "---") return <hr key={k} />
        if (b.startsWith("### ")) {
          const text = b.slice(4)
          return <h3 key={k} id={slugify(text)}>{inline(text, k)}</h3>
        }
        if (b.startsWith("## ")) {
          const text = b.slice(3)
          return (
            <h2 key={k} id={slugify(text)} className="scroll-mt-24">
              {inline(text, k)}
            </h2>
          )
        }
        if (b.startsWith(">"))
          return (
            <blockquote key={k}>
              {b.split("\n").map((l, li) => (
                <p key={li}>{inline(l.replace(/^>\s?/, ""), `${k}-${li}`)}</p>
              ))}
            </blockquote>
          )
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
        // table
        if (lines.length >= 2 && lines[0].trim().startsWith("|") && /^\s*\|?[\s:-]+\|/.test(lines[1])) {
          const row = (l: string) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim())
          const head = row(lines[0])
          const body = lines.slice(2).map(row)
          return (
            <div key={k} className="not-prose my-6 overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left">
                  <tr>
                    {head.map((h, hi) => (
                      <th key={hi} className="px-4 py-2.5 font-semibold">{inline(h, `${k}-h${hi}`)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((r, ri) => (
                    <tr key={ri} className="border-t">
                      {r.map((c, ci) => (
                        <td key={ci} className="px-4 py-2.5 align-top">{inline(c, `${k}-${ri}-${ci}`)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
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
