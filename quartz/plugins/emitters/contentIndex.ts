import { Root } from "hast"
import { GlobalConfiguration } from "../../cfg"
import { getDate } from "../../components/Date"
import { escapeHTML } from "../../util/escape"
import { FilePath, FullSlug, SimpleSlug, joinSegments, simplifySlug, getAllSegmentPrefixes } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { toHtml } from "hast-util-to-html"
import { write } from "./helpers"
import { i18n } from "../../i18n"
import DepGraph from "../../depgraph"
import { Content } from "../../components"
import { emailComment } from "../../util/comment"

export type ContentIndex = Map<FullSlug, ContentDetails>
export type ContentDetails = {
  title: string
  links: SimpleSlug[]
  tags: string[]
  content: string
  richContent?: string
  date?: Date
  description?: string,
  uri?: string,
  classes?: Set<string>
}

interface Options {
  enableSiteMap: boolean
  enableRSS: boolean
  rssLimit?: number
  rssFullHtml: boolean
  includeEmptyFiles: boolean
  rssRootFolder: string
}

const defaultOptions: Options = {
  enableSiteMap: true,
  enableRSS: true,
  rssLimit: 10,
  rssFullHtml: false,
  includeEmptyFiles: true,
  rssRootFolder: ""
}

function generateSiteMap(cfg: GlobalConfiguration, idx: ContentIndex): string {
  const base = cfg.baseUrl ?? ""
  const createURLEntry = (slug: SimpleSlug, content: ContentDetails): string => `<url>
    <loc>https://${joinSegments(base, encodeURI(slug))}</loc>
    ${content.date && `<lastmod>${content.date.toISOString()}</lastmod>`}
  </url>`
  const urls = Array.from(idx)
    .map(([slug, content]) => createURLEntry(simplifySlug(slug), content))
    .join("")
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`
}

function generateRSSFeed(cfg: GlobalConfiguration, idx: ContentIndex, limit?: number): string {
  const base = cfg.baseUrl ?? ""
  const year = new Date().getFullYear()

  const createURLEntry = (slug: SimpleSlug, content: ContentDetails): string => {
    const inviteComment = escapeHTML(`<p><a href="${emailComment(content.title)}">Email a comment</a></p>`);
    const description = content.richContent ? `${content.richContent}${inviteComment}` : `${content.description}${inviteComment}`;

    // DO NOT use the filename as a guid in RSS. If the name every changes, then RSS readers will pick up
    // the old file as a new file becuase Quartz uses the filename to create the GUID.
    // The GUID should be immutable from first publication. From 8 February 2025, I'm using tag: but prior
    // to that I have published items using URL as GUID. My Obsidian vault now has a URI for all that is
    // consistent so title changes or file moves, won't cause a future problem.
    let guid = ""
    if (content.uri !== undefined ) {
      if (content.uri.startsWith("tag:") ) {
        guid = content.uri
      } else {
        guid = `https://${joinSegments(base, encodeURI(slug))}`
      }
    } else {
      console.error(`Blog missing URI: ${content.title}`)
      process.exit(1)
  }

    return `<item>
        <title>${escapeHTML(content.title)}</title>
        <link>https://${joinSegments(base, encodeURI(slug))}</link>
        <guid>${guid}</guid>
        <description>${description}</description>
        <pubDate>${content.date?.toUTCString()}</pubDate>
      </item>`;
  }

  const items = Array.from(idx)
    .filter(([slug,content]) => slug.startsWith(`notes`) && content.classes?.includes("blog"))
    .sort(([_, f1], [__, f2]) => {
      if (f1.date && f2.date) {
        return f2.date.getTime() - f1.date.getTime()
      } else if (f1.date && !f2.date) {
        return -1
      } else if (!f1.date && f2.date) {
        return 1
      }
      return f1.title.localeCompare(f2.title)
    })
    .map(([slug, content]) => createURLEntry(simplifySlug(slug), content))
    .slice(0, limit ?? idx.size)
    .join("")

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escapeHTML(cfg.pageTitle)}</title>
      <link>https://${base}</link>
      <description>A digital garden cultivating the possibilities of life.</description>
      <copyright>© David C. Buchan 2002-${year}</copyright>
      <generator>Quartz -- quartz.jzhao.xyz</generator>
      <managingEditor>qg.info@mail.buchan.org</managingEditor>
      <webMaster>qg.info@mail.buchan.org (David Buchan)</webMaster>
      <atom:link href="https://quantumgardener.info/index.xml" rel="self" type="application/rss+xml" />
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <docs>https://www.rssboard.org/rss-specification</docs>
      <image>
        <url>https://${base}/static/qg-image.webp</url>
        <title>${escapeHTML(cfg.pageTitle)}</title>
        <link>https://${base}</link>
      </image>
      ${items}
    </channel>
  </rss>`
}

export const ContentIndex: QuartzEmitterPlugin<Partial<Options>> = (opts) => {
  opts = { ...defaultOptions, ...opts }
  return {
    name: "ContentIndex",
    async getDependencyGraph(ctx, content, _resources) {
      const graph = new DepGraph<FilePath>()

      for (const [_tree, file] of content) {
        const sourcePath = file.data.filePath!

        graph.addEdge(
          sourcePath,
          joinSegments(ctx.argv.output, "static/contentIndex.json") as FilePath,
        )
        if (opts?.enableSiteMap) {
          graph.addEdge(sourcePath, joinSegments(ctx.argv.output, "sitemap.xml") as FilePath)
        }
        if (opts?.enableRSS) {
          graph.addEdge(sourcePath, joinSegments(ctx.argv.output, "index.xml") as FilePath)
        }
      }

      return graph
    },
    async emit(ctx, content, _resources) {
      const cfg = ctx.cfg.configuration
      const emitted: FilePath[] = []
      const linkIndex: ContentIndex = new Map()
      for (const [tree, file] of content) {
        const slug = file.data.slug!
        const date = getDate(ctx.cfg.configuration, file.data) ?? new Date()
        if (opts?.includeEmptyFiles || (file.data.text && file.data.text !== "")) {
          linkIndex.set(slug, {
            title: file.data.frontmatter?.title!,
            links: file.data.links ?? [],
            tags: file.data.frontmatter?.tags ?? [],
            content: file.data.text ?? "",
            richContent: opts?.rssFullHtml
              ? escapeHTML(toHtml(tree as Root, { allowDangerousHtml: true }))
              : undefined,
            date: date,
            description: file.data.description ?? "",
            uri: file.data.frontmatter?.uri,
            classes: file.data.frontmatter?.classes
          })
        }
      }

      if (opts?.enableSiteMap) {
        emitted.push(
          await write({
            ctx,
            content: generateSiteMap(cfg, linkIndex),
            slug: "sitemap" as FullSlug,
            ext: ".xml",
          }),
        )
      }

      if (opts?.enableRSS) {
        emitted.push(
          await write({
            ctx,
            content: generateRSSFeed(cfg, linkIndex, opts.rssLimit),
            slug: "index" as FullSlug,
            ext: ".xml",
          }),
        )
      }

      const fp = joinSegments("static", "contentIndex") as FullSlug
      const simplifiedIndex = Object.fromEntries(
        Array.from(linkIndex).map(([slug, content]) => {
          // remove description and from content index as nothing downstream
          // actually uses it. we only keep it in the index as we need it
          // for the RSS feed
          delete content.description
          delete content.date
          return [slug, content]
        }),
      )

      emitted.push(
        await write({
          ctx,
          content: JSON.stringify(simplifiedIndex),
          slug: fp,
          ext: ".json",
        }),
      )

      return emitted
    },
    getQuartzComponents: () => [],
  }
}
