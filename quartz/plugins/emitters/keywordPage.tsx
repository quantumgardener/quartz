import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, QuartzPluginData, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import {
  FilePath,
  FullSlug,
  getAllSegmentPrefixes,
  joinSegments,
  pathToRoot,
} from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { KeywordContent } from "../../components"
import { write } from "./helpers"
import { i18n } from "../../i18n"
import DepGraph from "../../depgraph"

interface TagPageOptions extends FullPageLayout {
  sort?: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

export const KeywordPage: QuartzEmitterPlugin<Partial<TagPageOptions>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: KeywordContent({ sort: userOpts?.sort }),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "KeywordPage",
    getQuartzComponents() {
      return [
        Head,
        Header,
        Body,
        ...header,
        ...beforeBody,
        pageBody,
        ...afterBody,
        ...left,
        ...right,
        Footer,
      ]
    },
    async getDependencyGraph(ctx, content, _resources) {
      const graph = new DepGraph<FilePath>()

      for (const [_tree, file] of content) {
        const sourcePath = file.data.filePath!
        const keywords = (file.data.frontmatter?.keywords ?? []).flatMap(getAllSegmentPrefixes)
        // if the file has at least one keyword, it is used in the keyword index page
        if (keywords.length > 0) {
          keywords.push("index")
        }

        for (const keyword of keywords) {
          graph.addEdge(
            sourcePath,
            joinSegments(ctx.argv.output, "keywords", keyword + ".html") as FilePath,
          )
        }
      }

      return graph
    },
    async emit(ctx, content, resources): Promise<FilePath[]> {
      const fps: FilePath[] = []
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration

      const keywords: Set<string> = new Set(
        allFiles.flatMap((data) => data.frontmatter?.keywords ?? []).flatMap(getAllSegmentPrefixes),
      )

      // add base keyword
      keywords.add("index")

      const keywordDescriptions: Record<string, ProcessedContent> = Object.fromEntries(
        [...keywords].map((keyword) => {
          const title =
            keyword === "index"
              ? i18n(cfg.locale).pages.keywordContent.keywordIndex
              : `${i18n(cfg.locale).pages.keywordContent.keyword} ${keyword}`
          return [
            keyword,
            defaultProcessedContent({
              slug: joinSegments("keywords", keyword) as FullSlug,
              frontmatter: { title, keywords: [] },
            }),
          ]
        }),
      )

      for (const [tree, file] of content) {
        const slug = file.data.slug!
        if (slug.startsWith("keywords/")) {
          const keyword = slug.slice("keywords/".length)
          if (keywords.has(keyword)) {
            keywordDescriptions[keyword] = [tree, file]
            if (file.data.frontmatter?.title === keyword) {
              file.data.frontmatter.title = `${i18n(cfg.locale).pages.keywordContent.keyword}: ${keyword}`
            }
          }
        }
      }

      for (const keyword of keywords) {
        const slug = joinSegments("keywords", keyword) as FullSlug
        const [tree, file] = keywordDescriptions[keyword]
        const externalResources = pageResources(pathToRoot(slug), file.data, resources)
        const componentData: QuartzComponentProps = {
          ctx,
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles,
        }

        const content = renderPage(cfg, slug, componentData, opts, externalResources)
        const fp = await write({
          ctx,
          content,
          slug: file.data.slug!,
          ext: ".html",
        })

        fps.push(fp)
      }
      return fps
    },
  }
}