import React from 'react';
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import { mdxjs } from 'micromark-extension-mdxjs'
import { all, Handler } from 'mdast-util-to-hast'
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { gfmStrikethroughFromMarkdown, gfmStrikethroughToMarkdown } from 'mdast-util-gfm-strikethrough'
import { jsx } from 'slate-hyperscript'

export const mdxJsxTextElement: Handler = (h, node) => {
  // console.log(h)
  // console.log(node)
  return h(node, node.name, all(h, node))
}

export function markdown2html(markdown: string): any {
  // try {
    return unified()
      .data({
        micromarkExtensions: [mdxjs(), gfmStrikethrough()],
        fromMarkdownExtensions: [mdxFromMarkdown, gfmStrikethroughFromMarkdown],
      })
      .use(remarkParse)
      // .use(remarkHtml)
      // .parse(markdown)
      .use(remarkRehype, { handlers: { mdxJsxTextElement } })
      .use(rehypeRaw)
      .use(rehypeStringify)
    //   // // .use()
      .processSync(markdown).value
  // } catch (e) {
  //   return unified()
  //     .data({
  //       micromarkExtensions: [gfmStrikethrough()],
  //       fromMarkdownExtensions: [gfmStrikethroughFromMarkdown],
  //     })
  //     .use(remarkParse)
  //     .use(remarkRehype)
  //     .use(rehypeRaw)
  //     .use(rehypeStringify)
  //     .processSync(markdown).value
  // }
  
  
  // console.log(unimdast)

  // return remarkToSlate()
  // return unified()
  //   .use(remarkParse, { extensions: [mdxjs()], mdastExtensions: [mdxFromMarkdown] })
  //   // .use(remarkMdx)
  //   .use(remarkRehype, { allowDangerousHtml: true })
  //   .use(rehypeRaw) // *Parse* the raw HTML strings embedded in the tree
  //   .use(rehypeStringify)
  //   .processSync(markdown).value
  // return processor.processSync(markdown).result;
}

export function deserialize(el: any) {
  if (el.nodeType === 3) {
    return el.textContent
  } else if (el.nodeType !== 1) {
    return null
  }

  const children: Array<any> = Array.from(el.childNodes).map(deserialize)
  console.log(el.nodeName)
  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children)
    case 'BR':
      return '\n'
    case 'BLOCKQUOTE':
      return jsx('element', { type: 'quote' }, children)
    case 'P':
      return jsx('element', { type: 'paragraph' }, children)
    case 'A':
      return jsx(
        'element',
        { type: 'link', url: el.getAttribute('href') },
        children
      )
    case 'SUMMARY':
      return jsx('element', { type: 'summary' }, children)
    case 'DETAILS':
      return jsx('element', { type: 'details' }, children)

    default:
      return el.textContent
  }
}