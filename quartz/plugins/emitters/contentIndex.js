import { getDate } from "../../components/Date";
import { escapeHTML } from "../../util/escape";
import { joinSegments, simplifySlug } from "../../util/path";
import { toHtml } from "hast-util-to-html";
import { write } from "./helpers";
import DepGraph from "../../depgraph";
const defaultOptions = {
    enableSiteMap: true,
    enableRSS: true,
    rssLimit: 10,
    rssFullHtml: false,
    includeEmptyFiles: true,
    rssRootFolder: ""
};
function generateSiteMap(cfg, idx) {
    const base = cfg.baseUrl ?? "";
    const createURLEntry = (slug, content) => `<url>
    <loc>https://${joinSegments(base, encodeURI(slug))}</loc>
    ${content.date && `<lastmod>${content.date.toISOString()}</lastmod>`}
  </url>`;
    const urls = Array.from(idx)
        .map(([slug, content]) => createURLEntry(simplifySlug(slug), content))
        .join("");
    return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`;
}
function generateRSSFeed(cfg, idx, rssRootFolder, limit) {
    const base = cfg.baseUrl ?? "";
    const year = new Date().getFullYear();
    const createURLEntry = (slug, content) => `<item>
    <title>${escapeHTML(content.title)}</title>
    <link>https://${joinSegments(base, encodeURI(slug))}</link>
    <guid>https://${joinSegments(base, encodeURI(slug))}</guid>
    <description>${content.richContent ?? content.description}</description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`;
    const items = Array.from(idx)
        .filter(([slug, content]) => slug.startsWith(`${rssRootFolder}`) && content.title != "Blog")
        .sort(([_, f1], [__, f2]) => {
        if (f1.date && f2.date) {
            return f2.date.getTime() - f1.date.getTime();
        }
        else if (f1.date && !f2.date) {
            return -1;
        }
        else if (!f1.date && f2.date) {
            return 1;
        }
        return f1.title.localeCompare(f2.title);
    })
        .map(([slug, content]) => createURLEntry(simplifySlug(slug), content))
        .slice(0, limit ?? idx.size)
        .join("");
    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escapeHTML(cfg.pageTitle)}</title>
      <link>https://${base}</link>
      <description>A digital garden cultivating the possibilities of life.</description>
      <copyright>© David C. Buchan 2002-${year}</copyright>
      <generator>Quartz -- quartz.jzhao.xyz</generator>
      <managingEditor>qg.info@mail.buchan.org</managingEditor>
      <webMaster>5wjw9aq33@mozmail.com (David Buchan)</webMaster>
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
  </rss>`;
}
export const ContentIndex = (opts) => {
    opts = { ...defaultOptions, ...opts };
    return {
        name: "ContentIndex",
        async getDependencyGraph(ctx, content, _resources) {
            const graph = new DepGraph();
            for (const [_tree, file] of content) {
                const sourcePath = file.data.filePath;
                graph.addEdge(sourcePath, joinSegments(ctx.argv.output, "static/contentIndex.json"));
                if (opts?.enableSiteMap) {
                    graph.addEdge(sourcePath, joinSegments(ctx.argv.output, "sitemap.xml"));
                }
                if (opts?.enableRSS) {
                    graph.addEdge(sourcePath, joinSegments(ctx.argv.output, "index.xml"));
                }
            }
            return graph;
        },
        async emit(ctx, content, _resources) {
            const cfg = ctx.cfg.configuration;
            const emitted = [];
            const linkIndex = new Map();
            for (const [tree, file] of content) {
                const slug = file.data.slug;
                const date = getDate(ctx.cfg.configuration, file.data) ?? new Date();
                if (opts?.includeEmptyFiles || (file.data.text && file.data.text !== "")) {
                    linkIndex.set(slug, {
                        title: file.data.frontmatter?.title,
                        links: file.data.links ?? [],
                        tags: file.data.frontmatter?.tags ?? [],
                        content: file.data.text ?? "",
                        richContent: opts?.rssFullHtml
                            ? escapeHTML(toHtml(tree, { allowDangerousHtml: true }))
                            : undefined,
                        date: date,
                        description: file.data.description ?? "",
                    });
                }
            }
            if (opts?.enableSiteMap) {
                emitted.push(await write({
                    ctx,
                    content: generateSiteMap(cfg, linkIndex),
                    slug: "sitemap",
                    ext: ".xml",
                }));
            }
            if (opts?.enableRSS) {
                emitted.push(await write({
                    ctx,
                    content: generateRSSFeed(cfg, linkIndex, opts.rssRootFolder, opts.rssLimit),
                    slug: "index",
                    ext: ".xml",
                }));
            }
            const fp = joinSegments("static", "contentIndex");
            const simplifiedIndex = Object.fromEntries(Array.from(linkIndex).map(([slug, content]) => {
                // remove description and from content index as nothing downstream
                // actually uses it. we only keep it in the index as we need it
                // for the RSS feed
                delete content.description;
                delete content.date;
                return [slug, content];
            }));
            emitted.push(await write({
                ctx,
                content: JSON.stringify(simplifiedIndex),
                slug: fp,
                ext: ".json",
            }));
            return emitted;
        },
        getQuartzComponents: () => [],
    };
};
