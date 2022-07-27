import type { Plugin, VFileWithOutput } from 'unified'
import type { Element, Root } from 'hast'

import { toString } from 'hast-util-to-string'
import { EXIT, visit } from 'unist-util-visit'

export interface RehypeExtractExcerptOptions {
  /** The var name of the vFile.data export. defaults to `excerpt` */
  name?: string

  /** The character length to truncate the excerpt. defaults to 140  */
  maxLength?: number

  /** The ellipsis to add to the excerpt. defaults to `...` */
  ellipsis?: string

  /** Truncate the excerpt at word boundary. defaults to `true` */
  wordBoundaries?: boolean
}

const defaults: RehypeExtractExcerptOptions = {
  name: 'excerpt',
  maxLength: 140,
  ellipsis: '...',
  wordBoundaries: true
}

const rehypeExtractExcerpt: Plugin<
  [RehypeExtractExcerptOptions?],
  Root,
  void
> = (userOptions?: RehypeExtractExcerptOptions) => {
  const options = { ...defaults, ...userOptions }

  return (tree: Root, vfile: VFileWithOutput<unknown>) => {
    const excerpt: string[] = []

    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'p') {
        return
      }

      excerpt.push(
        truncateExcerpt(
          toString(node),
          options.maxLength!,
          options.ellipsis!,
          options.wordBoundaries!
        )
      )

      return EXIT
    })

    vfile.data[options.name!] = excerpt[0]
  }
}

function truncateExcerpt(
  str: string,
  maxLength: number,
  ellipsis: string,
  wordBoundaries: boolean
): string {
  if (str.length > maxLength) {
    if (wordBoundaries) {
      return `${str.slice(0, str.lastIndexOf(' ', maxLength - 1))}${ellipsis}`
    }
    return `${str.slice(0, maxLength)}${ellipsis}`
  }
  return str
}

export default rehypeExtractExcerpt
