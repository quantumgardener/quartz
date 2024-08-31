import HeaderConstructor from "../../components/Header";
import BodyConstructor from "../../components/Body";
import { pageResources, renderPage } from "../../components/renderPage";
import { defaultProcessedContent } from "../vfile";
import { getAllSegmentPrefixes, joinSegments, pathToRoot, } from "../../util/path";
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout";
import { TagContent } from "../../components";
import { write } from "./helpers";
import { i18n } from "../../i18n";
import DepGraph from "../../depgraph";
export const TagPage = (userOpts) => {
    const opts = {
        ...sharedPageComponents,
        ...defaultListPageLayout,
        pageBody: TagContent({ sort: userOpts?.sort }),
        ...userOpts,
    };
    const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts;
    const Header = HeaderConstructor();
    const Body = BodyConstructor();
    return {
        name: "TagPage",
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
            ];
        },
        async getDependencyGraph(ctx, content, _resources) {
            const graph = new DepGraph();
            for (const [_tree, file] of content) {
                const sourcePath = file.data.filePath;
                const tags = (file.data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes);
                // if the file has at least one tag, it is used in the tag index page
                if (tags.length > 0) {
                    tags.push("index");
                }
                for (const tag of tags) {
                    graph.addEdge(sourcePath, joinSegments(ctx.argv.output, "tags", tag + ".html"));
                }
            }
            return graph;
        },
        async emit(ctx, content, resources) {
            const fps = [];
            const allFiles = content.map((c) => c[1].data);
            const cfg = ctx.cfg.configuration;
            const tags = new Set(allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes));
            // add base tag
            tags.add("index");
            const tagDescriptions = Object.fromEntries([...tags].map((tag) => {
                const title = tag === "index"
                    ? i18n(cfg.locale).pages.tagContent.tagIndex
                    : `${i18n(cfg.locale).pages.tagContent.tag} ${tag}`;
                return [
                    tag,
                    defaultProcessedContent({
                        slug: joinSegments("topics", tag),
                        frontmatter: { title, tags: [] },
                    }),
                ];
            }));
            for (const [tree, file] of content) {
                const slug = file.data.slug;
                if (slug.startsWith("topics/")) {
                    const tag = slug.slice("topics/".length);
                    if (tags.has(tag)) {
                        tagDescriptions[tag] = [tree, file];
                    }
                }
            }
            for (const tag of tags) {
                const slug = joinSegments("topics", tag);
                const externalResources = pageResources(pathToRoot(slug), resources);
                const [tree, file] = tagDescriptions[tag];
                const componentData = {
                    ctx,
                    fileData: file.data,
                    externalResources,
                    cfg,
                    children: [],
                    tree,
                    allFiles,
                };
                const content = renderPage(cfg, slug, componentData, opts, externalResources);
                const fp = await write({
                    ctx,
                    content,
                    slug: file.data.slug,
                    ext: ".html",
                });
                fps.push(fp);
            }
            return fps;
        },
    };
};
