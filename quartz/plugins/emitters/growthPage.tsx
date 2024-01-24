import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FilePath, FullSlug, getAllSegmentPrefixes, joinSegments, pathToRoot,} from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { GrowthContent } from "../../components"
import { write } from "./helpers"

export const GrowthPage: QuartzEmitterPlugin<FullPageLayout> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: GrowthContent(),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "GrowthPage",
    getQuartzComponents() {
      return [Head, Header, Body, ...header, ...beforeBody, pageBody, ...left, ...right, Footer]
    },
    async emit(ctx, content, resources): Promise<FilePath[]> {
      const fps: FilePath[] = []
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration

      const growths: Set<string> = new Set(
        allFiles.flatMap((data) => data.frontmatter?.growth ?? []).flatMap(getAllSegmentPrefixes),
      )
      // add base growth page
      growths.add("index")

      const growthDescriptions: Record<string, ProcessedContent> = Object.fromEntries(
        [...growths].map((growth) => {
          const title = growth === "" ? "Growth Index" : `${growth}`
          return [
            growth,
            defaultProcessedContent({
              slug: joinSegments("maturity", growth) as FullSlug,
              frontmatter: { title, tags: [], landscapes: [] },
            }),
          ]
        }),
      )

      for (const [tree, file] of content) {
        const slug = file.data.slug!
        if (slug.startsWith("maturity/")) {
          const growth = slug.slice("maturity/".length)
          if (growths.has(growth)) {
            growthDescriptions[growth] = [tree, file]
          }
        }
      }

      for (const growth of growths) {
        const slug = joinSegments("maturity", growth) as FullSlug
        const externalResources = pageResources(pathToRoot(slug), resources)
        const [tree, file] = growthDescriptions[growth]
        const componentData: QuartzComponentProps = {
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles,
        }

        const content = renderPage(slug, componentData, opts, externalResources)
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
