import { joinSegments, resolveRelative, simplifySlug } from "../../util/path";
import path from "path";
import { write } from "./helpers";
import DepGraph from "../../depgraph";
export const AliasRedirects = () => ({
    name: "AliasRedirects",
    getQuartzComponents() {
        return [];
    },
    async getDependencyGraph(ctx, content, _resources) {
        const graph = new DepGraph();
        const { argv } = ctx;
        for (const [_tree, file] of content) {
            const dir = path.posix.relative(argv.directory, path.dirname(file.data.filePath));
            const aliases = file.data.frontmatter?.aliases ?? [];
            const slugs = aliases.map((alias) => path.posix.join(dir, alias));
            const permalink = file.data.frontmatter?.permalink;
            if (typeof permalink === "string") {
                slugs.push(permalink);
            }
            for (let slug of slugs) {
                // fix any slugs that have trailing slash
                if (slug.endsWith("/")) {
                    slug = joinSegments(slug, "index");
                }
                graph.addEdge(file.data.filePath, joinSegments(argv.output, slug + ".html"));
            }
        }
        return graph;
    },
    async emit(ctx, content, _resources) {
        const { argv } = ctx;
        const fps = [];
        for (const [_tree, file] of content) {
            const ogSlug = simplifySlug(file.data.slug);
            const dir = path.posix.relative(argv.directory, path.dirname(file.data.filePath));
            const aliases = file.data.frontmatter?.aliases ?? [];
            const slugs = aliases.map((alias) => path.posix.join(dir, alias));
            const permalink = file.data.frontmatter?.permalink;
            if (typeof permalink === "string") {
                slugs.push(permalink);
            }
            for (let slug of slugs) {
                // fix any slugs that have trailing slash
                if (slug.endsWith("/")) {
                    slug = joinSegments(slug, "index");
                }
                const redirUrl = resolveRelative(slug, file.data.slug);
                const fp = await write({
                    ctx,
                    content: `
            <!DOCTYPE html>
            <html lang="en-au">
            <head>
            <title>${ogSlug}</title>
            <link rel="canonical" href="${redirUrl}">
            <meta name="robots" content="noindex">
            <meta charset="utf-8">
            <meta http-equiv="refresh" content="0; url=${redirUrl}">
            </head>
            </html>
            `,
                    slug,
                    ext: ".html",
                });
                fps.push(fp);
            }
        }
        return fps;
    },
});
