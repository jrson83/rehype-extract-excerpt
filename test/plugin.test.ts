import rehypeExtractExcerpt, { type RehypeExtractExcerptOptions } from '../src'

import { deepStrictEqual } from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, it } from 'node:test'

import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const cwd = process.cwd()
const path = (file: string) => resolve(cwd, 'test', 'markdown', file)

function createProcessor(options?: RehypeExtractExcerptOptions) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeExtractExcerpt, options)
    .use(rehypeStringify)

  return processor
}

describe('plugin test', () => {
  it('should attach excerpt to vfile.data.excerpt with default options', async () => {
    const { data } = await createProcessor().process(
      await readFile(path('markdown.md'), { encoding: 'utf8' })
    )

    deepStrictEqual(data, {
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad...',
    })
  })

  it('should attach excerpt to vfile.data.excerpt without truncating', async () => {
    const { data } = await createProcessor().process(
      await readFile(path('short.md'), { encoding: 'utf8' })
    )

    deepStrictEqual(data, {
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    })
  })

  it('should attach `undefined` excerpt to vfile.data.excerpt', async () => {
    const { data } = await createProcessor().process(
      await readFile(path('empty.md'), { encoding: 'utf8' })
    )

    deepStrictEqual(data, {
      excerpt: undefined,
    })
  })

  it('should attach excerpt to vfile.data.excerpt with custom maxLength', async () => {
    const { data } = await createProcessor({ maxLength: 20 }).process(
      await readFile(path('markdown.md'), { encoding: 'utf8' })
    )

    deepStrictEqual(data, {
      excerpt: 'Lorem ipsum dolor...',
    })
  })

  it('should attach excerpt to vfile.data.customExcerpt', async () => {
    const { data } = await createProcessor({ name: 'customExcerpt' }).process(
      await readFile(path('markdown.md'), { encoding: 'utf8' })
    )

    deepStrictEqual(data, {
      customExcerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad...',
    })
  })

  it('should attach excerpt to vfile.data.excerpt with custom ellipsis', async () => {
    const { data } = await createProcessor({ ellipsis: '---' }).process(
      await readFile(path('markdown.md'), { encoding: 'utf8' })
    )

    deepStrictEqual(data, {
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad---',
    })
  })

  it('should attach excerpt to vfile.data.excerpt without truncating word boundaries', async () => {
    const { data } = await createProcessor({ wordBoundaries: false }).process(
      await readFile(path('markdown.md'), { encoding: 'utf8' })
    )

    deepStrictEqual(data, {
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim...',
    })
  })

  it('should attach excerpt to vfile.data.excerpt without truncating word boundaries and without ellipsis', async () => {
    const { data } = await createProcessor({
      ellipsis: '',
      wordBoundaries: false,
    }).process(await readFile(path('markdown.md'), { encoding: 'utf8' }))

    deepStrictEqual(data, {
      excerpt:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim',
    })
  })

  it('should extract excerpt from a custom HTML tag', async () => {
    const { data } = await createProcessor({ tagName: 'h1' }).process(
      await readFile(path('markdown.md'), { encoding: 'utf8' })
    )

    deepStrictEqual(data, {
      excerpt: 'Test heading h1',
    })
  })
})
