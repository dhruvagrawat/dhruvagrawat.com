import { Markdown } from "./markdown"

/** Wraps a Markdown post so it fits the same registry shape as the older TSX posts. */
export function mdModule<M extends { body?: string }>(meta: M) {
  function Content() {
    return <Markdown source={meta.body ?? ""} />
  }
  return { metadata: meta, default: Content }
}
