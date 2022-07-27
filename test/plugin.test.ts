import type { RehypeExtractExcerptOptions } from '../src'

import { expect, it } from 'vitest'

import { resolve } from 'path'
import { promises as fs } from 'fs'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeExtractExcerpt from '../src'

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

it('should attach excerpt to vfile.data.excerpt with default options', async () => {
  const { data } = await createProcessor().process(
    await fs.readFile(path('markdown.md'), { encoding: 'utf8' })
  )

  expect(data).toMatchInlineSnapshot(`
    {
      "excerpt": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad...",
    }
  `)
})

it('should attach excerpt to vfile.data.excerpt without truncating', async () => {
  const { data } = await createProcessor().process(
    await fs.readFile(path('short.md'), { encoding: 'utf8' })
  )

  expect(data).toMatchInlineSnapshot(`
    {
      "excerpt": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    }
  `)
})

it('should attach `undefined` excerpt to vfile.data.excerpt', async () => {
  const { data } = await createProcessor().process(
    await fs.readFile(path('empty.md'), { encoding: 'utf8' })
  )

  expect(data).toMatchInlineSnapshot(`
    {
      "excerpt": undefined,
    }
  `)
})

it('should attach excerpt to vfile.data.excerpt with custom maxLength', async () => {
  const { data } = await createProcessor({ maxLength: 20 }).process(
    await fs.readFile(path('markdown.md'), { encoding: 'utf8' })
  )

  expect(data).toMatchInlineSnapshot(`
    {
      "excerpt": "Lorem ipsum dolor...",
    }
  `)
})

it('should attach excerpt to vfile.data.customExcerpt', async () => {
  const { data } = await createProcessor({ name: 'customExcerpt' }).process(
    await fs.readFile(path('markdown.md'), { encoding: 'utf8' })
  )

  expect(data).toMatchInlineSnapshot(`
    {
      "customExcerpt": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad...",
    }
  `)
})

it('should attach excerpt to vfile.data.excerpt with custom ellipsis', async () => {
  const { data } = await createProcessor({ ellipsis: '---' }).process(
    await fs.readFile(path('markdown.md'), { encoding: 'utf8' })
  )

  expect(data).toMatchInlineSnapshot(`
    {
      "excerpt": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad---",
    }
  `)
})

it('should attach excerpt to vfile.data.excerpt without truncating word boundaries', async () => {
  const { data } = await createProcessor({ wordBoundaries: false }).process(
    await fs.readFile(path('markdown.md'), { encoding: 'utf8' })
  )

  expect(data).toMatchInlineSnapshot(`
    {
      "excerpt": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim...",
    }
  `)
})

it('should attach excerpt to vfile.data.excerpt without truncating word boundaries and without ellipsis', async () => {
  const { data } = await createProcessor({
    ellipsis: '',
    wordBoundaries: false
  }).process(await fs.readFile(path('markdown.md'), { encoding: 'utf8' }))

  expect(data).toMatchInlineSnapshot(`
    {
      "excerpt": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim",
    }
  `)
})
