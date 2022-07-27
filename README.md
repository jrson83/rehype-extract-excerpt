# rehype-extract-excerpt

**[rehype](https://github.com/rehypejs/rehype)** plugin which attaches a document's first paragraph to the VFile.

## Contents

- [What is this?](#what-is-this)
- [When should I use this?](#when-should-i-use-this)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [`unified().use(rehypeExtractExcerpt, options?)`](#unifieduserehypeextractexcerpt-options)
- [Types](#types)
- [Security](#security)
- [Related](#related)
- [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin to extract the first paragraph of a document.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**rehype** adds support for HTML to unified.
**vfile** is the virtual file interface used in unified.
**hast** is the HTML AST that rehype uses.

This is a rehype plugin that inspects hast and adds an excerpt to vfiles.

## When should I use this?

This plugin is useful if you want to use the first paragraph of a markdown file as description, instead of adding a `description` to the `frontmatter`.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, 16.0+, or 18.0+), install with [npm](https://docs.npmjs.com/cli/install):

```shell
npm install rehype-extract-excerpt
```

In Deno, with [esm.sh](https://esm.sh/):

<!-- prettier-ignore -->
```js
import rehypeExtractExcerpt from 'https://esm.sh/rehype-extract-excerpt'
```

In browsers, with [esm.sh](https://esm.sh/):

<!-- prettier-ignore -->
```js
<script type="module">
  import rehypeExtractExcerpt from 'https://esm.sh/rehype-extract-excerpt?bundle'
</script>
```

## Use

Say our module `example.js` looks as follows:

<!-- prettier-ignore -->
```js
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeExtractExcerpt from 'rehype-extract-excerpt'
import rehypeStringify from 'rehype-stringify'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeExtractExcerpt)
  .use(rehypeStringify).process(`# Test heading h1

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Test heading h2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`)

console.log(file.data)
console.log(String(file))
```

…now running `node example.js` yields:

```js
{
  excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad...'
}
```

## API

This package exports no identifiers.
The default export is `rehypeExtractExcerpt`.

### `unified().use(rehypeExtractExcerpt, options?)`

Attach a document's first paragraph as file metadata.
The result is stored on `file.data.excerpt`.
If the document does not contain a paragraph, `data.extract` value will be `undefined`.

##### `options`

Configuration (optional).

##### `options.name`

The var name of the vFile.data export. (`string`, default: `'excerpt'`).

##### `options.maxLength`

The character length to truncate the excerpt. (`number`, default: `140`).

##### `options.ellipsis`

The ellipsis to add to the excerpt. Use `''` to disable. (`string`, default: `'...'`).

##### `options.wordBoundaries`

Truncate the excerpt at word boundary. (`boolean`, default: `true`).

## Types

This package is fully typed with [TypeScript](https://www.typescriptlang.org/).
The additional type `RehypeExtractExcerptOptions` is exported.

## Security

Use of `rehype-extract-excerpt` is safe.

## Related

- [`@stefanprobst/rehype-extract-toc`](https://github.com/stefanprobst/rehype-extract-toc) &mdash; plugin which attaches a document's table of contents to the VFile
- [`@stefanprobst/remark-excerpt`](https://github.com/stefanprobst/remark-excerpt) &mdash; transformer plugin to extract an excerpt

## License

[MIT](./LICENSE.md)
