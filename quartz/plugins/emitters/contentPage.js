import path from "path";
import { visit } from "unist-util-visit";
import HeaderConstructor from "../../components/Header";
import BodyConstructor from "../../components/Body";
import { pageResources, renderPage } from "../../components/renderPage";
import { isRelativeURL, joinSegments, pathToRoot } from "../../util/path";
import { defaultContentPageLayout, sharedPageComponents } from "../../../quartz.layout";
import { Content } from "../../components";
import chalk from "chalk";
import { write } from "./helpers";
import DepGraph from "../../depgraph";
// get all the dependencies for the markdown file
// eg. images, scripts, stylesheets, transclusions
const parseDependencies = (argv, hast, file) => {
    const dependencies = [];
    visit(hast, "element", (elem) => {
        let ref = null;
        if (["script", "img", "audio", "video", "source", "iframe"].includes(elem.tagName) &&
            elem?.properties?.src) {
            ref = elem.properties.src.toString();
        }
        else if (["a", "link"].includes(elem.tagName) && elem?.properties?.href) {
            // transclusions will create a tags with relative hrefs
            ref = elem.properties.href.toString();
        }
        // if it is a relative url, its a local file and we need to add
        // it to the dependency graph. otherwise, ignore
        if (ref === null || !isRelativeURL(ref)) {
            return;
        }
        let fp = path.join(file.data.filePath, path.relative(argv.directory, ref)).replace(/\\/g, "/");
        // markdown files have the .md extension stripped in hrefs, add it back here
        if (!fp.split("/").pop()?.includes(".")) {
            fp += ".md";
        }
        dependencies.push(fp);
    });
    return dependencies;
};
export const ContentPage = (userOpts) => {
    const opts = {
        ...sharedPageComponents,
        ...defaultContentPageLayout,
        pageBody: Content(),
        ...userOpts,
    };
    const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts;
    const Header = HeaderConstructor();
    const Body = BodyConstructor();
    return {
        name: "ContentPage",
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
            for (const [tree, file] of content) {
                const sourcePath = file.data.filePath;
                const slug = file.data.slug;
                graph.addEdge(sourcePath, joinSegments(ctx.argv.output, slug + ".html"));
                parseDependencies(ctx.argv, tree, file).forEach((dep) => {
                    graph.addEdge(dep, sourcePath);
                });
            }
            return graph;
        },
        async emit(ctx, content, resources) {
            const cfg = ctx.cfg.configuration;
            const fps = [];
            const allFiles = content.map((c) => c[1].data);
            let containsIndex = false;
            for (const [tree, file] of content) {
                const slug = file.data.slug;
                if (slug === "index") {
                    containsIndex = true;
                }
                const externalResources = pageResources(pathToRoot(slug), resources);
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
            if (!containsIndex && !ctx.argv.fastRebuild) {
                console.log(chalk.yellow(`\nWarning: you seem to be missing an \`index.md\` home page file at the root of your \`${ctx.argv.directory}\` folder. This may cause errors when deploying.`));
            }
            return fps;
        },
    };
};
