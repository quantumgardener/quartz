import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import {
  FilePath,
  FullSlug,
  getAllSegmentPrefixes,
  joinSegments,
  pathToRoot,
} from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { LandscapeContent } from "../../components"
import { write } from "./helpers"
import { i18n } from "../../i18n"
import DepGraph from "../../depgraph"

export const LandscapePage: QuartzEmitterPlugin<FullPageLayout> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: LandscapeContent(),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "LandscapePage",
    getQuartzComponents() {
      return [Head, Header, Body, ...header, ...beforeBody, pageBody, ...left, ...right, Footer]
    },
    async getDependencyGraph(ctx, content, _resources) {
      const graph = new DepGraph<FilePath>()

      for (const [_tree, file] of content) {
        const sourcePath = file.data.filePath!
        const tags = (file.data.frontmatter?.landscapes ?? []).flatMap(getAllSegmentPrefixes)
        // if the file has at least one tag, it is used in the tag index page
        if (tags.length > 0) {
          tags.push("index")
        }

        for (const tag of tags) {
          graph.addEdge(
            sourcePath,
            joinSegments(ctx.argv.output, "tags", tag + ".html") as FilePath,
          )
        }
      }

      return graph
    },
    async emit(ctx, content, resources): Promise<FilePath[]> {
      const fps: FilePath[] = []
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration

      const landscapes: Set<string> = new Set(
        allFiles.flatMap((data) => data.frontmatter?.landscapes ?? []).flatMap(getAllSegmentPrefixes),
      )
      // add base landscape
      landscapes.add("index")

      const landscapeDescriptions: Record<string, ProcessedContent> = Object.fromEntries(
        [...landscapes].map((landscape) => {
          const title = landscape === "" ? "Landscape Index" : `${landscape}`
          return [
            landscape,
            defaultProcessedContent({
              slug: joinSegments("landscapes", landscape) as FullSlug,
              frontmatter: { title, tags: [], landscapes: [] },
            }),
          ]
        }),
      )

      for (const [tree, file] of content) {
        const slug = file.data.slug!
        if (slug.startsWith("landscapes/")) {
          const landscape = slug.slice("landscapes/".length)
          if (landscapes.has(landscape)) {
            landscapeDescriptions[landscape] = [tree, file]
          }
        }
      }

      for (const landscape of landscapes) {
        const slug = joinSegments("landscapes", landscape) as FullSlug
        const externalResources = pageResources(pathToRoot(slug), resources)
        const [tree, file] = landscapeDescriptions[landscape]
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
