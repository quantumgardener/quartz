import BodyConstructor from "../../components/Body";
import { pageResources, renderPage } from "../../components/renderPage";
import { sharedPageComponents } from "../../../quartz.layout";
import { NotFound, Search, Darkmode, PageTitle, MobileOnly, ArticleTitle, Spacer, SiteLogo } from "../../components";
import { defaultProcessedContent } from "../vfile";
import { write } from "./helpers";
import { i18n } from "../../i18n";
import DepGraph from "../../depgraph";
export const NotFoundPage = () => {
    const opts = {
        ...sharedPageComponents,
        pageBody: NotFound(),
        beforeBody: [ArticleTitle()],
        left: [
            SiteLogo(),
            PageTitle(),
            MobileOnly(Spacer()),
            Search(),
            Darkmode(),
        ],
        right: [],
    };
    const { head: Head, pageBody, footer: Footer } = opts;
    const Body = BodyConstructor();
    return {
        name: "404Page",
        getQuartzComponents() {
            return [Head, Body, pageBody, Footer];
        },
        async getDependencyGraph(_ctx, _content, _resources) {
            return new DepGraph();
        },
        async emit(ctx, _content, resources) {
            const cfg = ctx.cfg.configuration;
            const slug = "404";
            const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`);
            const path = url.pathname;
            const externalResources = pageResources(path, resources);
            const notFound = i18n(cfg.locale).pages.error.title;
            const [tree, vfile] = defaultProcessedContent({
                slug,
                text: "Not Found",
                description: "Not Found",
                frontmatter: { title: "Page Not Found", tags: [] },
            });
            const componentData = {
                ctx,
                fileData: vfile.data,
                externalResources,
                cfg,
                children: [],
                tree,
                allFiles: [],
            };
            return [
                await write({
                    ctx,
                    content: renderPage(cfg, slug, componentData, opts, externalResources),
                    slug,
                    ext: ".html",
                }),
            ];
        },
    };
};
