import HeaderConstructor from "../../components/Header";
import BodyConstructor from "../../components/Body";
import { pageResources, renderPage } from "../../components/renderPage";
import { defaultProcessedContent } from "../vfile";
import path from "path";
import { stripSlashes, joinSegments, pathToRoot, simplifySlug, } from "../../util/path";
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout";
import { FolderContent } from "../../components";
import { write } from "./helpers";
import { i18n } from "../../i18n";
import DepGraph from "../../depgraph";
export const FolderPage = (userOpts) => {
    const opts = {
        ...sharedPageComponents,
        ...defaultListPageLayout,
        pageBody: FolderContent({ sort: userOpts?.sort }),
        ...userOpts,
    };
    const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts;
    const Header = HeaderConstructor();
    const Body = BodyConstructor();
    return {
        name: "FolderPage",
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
        async getDependencyGraph(_ctx, content, _resources) {
            // Example graph:
            // nested/file.md --> nested/index.html
            // nested/file2.md ------^
            const graph = new DepGraph();
            content.map(([_tree, vfile]) => {
                const slug = vfile.data.slug;
                const folderName = path.dirname(slug ?? "");
                if (slug && folderName !== "." && folderName !== "tags") {
                    graph.addEdge(vfile.data.filePath, joinSegments(folderName, "index.html"));
                }
            });
            return graph;
        },
        async emit(ctx, content, resources) {
            const fps = [];
            const allFiles = content.map((c) => c[1].data);
            const cfg = ctx.cfg.configuration;
            const folders = new Set(allFiles.flatMap((data) => {
                const slug = data.slug;
                const folderName = path.dirname(slug ?? "");
                if (slug && folderName !== "." && folderName !== "topics") {
                    return [folderName];
                }
                return [];
            }));
            const folderDescriptions = Object.fromEntries([...folders].map((folder) => [
                folder,
                defaultProcessedContent({
                    slug: joinSegments(folder, "index"),
                    frontmatter: {
                        title: `${i18n(cfg.locale).pages.folderContent.folder}: ${folder}`,
                        tags: [],
                    },
                }),
            ]));
            for (const [tree, file] of content) {
                const slug = stripSlashes(simplifySlug(file.data.slug));
                if (folders.has(slug)) {
                    folderDescriptions[slug] = [tree, file];
                }
            }
            for (const folder of folders) {
                const slug = joinSegments(folder, "index");
                const externalResources = pageResources(pathToRoot(slug), resources);
                const [tree, file] = folderDescriptions[folder];
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
                    slug,
                    ext: ".html",
                });
                fps.push(fp);
            }
            return fps;
        },
    };
};
