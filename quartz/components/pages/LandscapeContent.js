import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "../styles/listPage.scss";
import { PageList } from "../PageList";
import { getAllSegmentPrefixes, simplifySlug } from "../../util/path";
import { htmlToJsx } from "../../util/jsx";
import { i18n } from "../../i18n";
const numPages = 10;
const LandscapeContent = (props) => {
    const { tree, fileData, allFiles, cfg } = props;
    const slug = fileData.slug;
    if (!(slug?.startsWith("landscapes/") || slug === "landscapes")) {
        throw new Error(`Component "LandscapeContent" tried to render a non-landscape page: ${slug}`);
    }
    const landscape = simplifySlug(slug.slice("landscapes/".length));
    const allPagesWithLandscape = (landscape) => allFiles.filter((file) => (file.frontmatter?.landscapes ?? []).flatMap(getAllSegmentPrefixes).includes(landscape));
    const content = tree.children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath, tree);
    const cssClasses = fileData.frontmatter?.cssclasses ?? [];
    const classes = ["popover-hint", ...cssClasses].join(" ");
    if (landscape === "/" || slug.slice(-6) == "/index") {
        const landscapes = [
            ...new Set(allFiles.flatMap((data) => data.frontmatter?.landscapes ?? []).flatMap(getAllSegmentPrefixes)),
        ].sort((a, b) => a.localeCompare(b));
        const landscapeItemMap = new Map();
        for (const landscape of landscapes) {
            landscapeItemMap.set(landscape, allPagesWithLandscape(landscape));
        }
        return (_jsxs("div", { class: classes, children: [_jsx("article", { children: _jsx("p", { children: content }) }), _jsx("p", { children: i18n(cfg.locale).pages.landscapeContent.totalTags({ count: landscapes.length }) }), _jsx("hr", {}), _jsx("div", { children: landscapes.map((landscape) => {
                        const pages = landscapeItemMap.get(landscape);
                        const listProps = {
                            ...props,
                            allFiles: pages,
                        };
                        const contentPage = allFiles.filter((file) => file.slug === `landscapes/${landscape}`)[0];
                        const content = contentPage?.description;
                        const title = contentPage?.frontmatter?.title;
                        return (_jsxs("div", { children: [_jsx("h2", { children: _jsx("a", { class: "internal tag-link", href: `/landscapes/${landscape}`, children: title }) }), content && _jsx("p", { children: content }), _jsxs("div", { class: "page-listing", children: [_jsxs("p", { children: [i18n(cfg.locale).pages.landscapeContent.itemsUnderTag({ count: pages.length }), pages.length > numPages && (_jsxs(_Fragment, { children: [" ", _jsx("span", { children: i18n(cfg.locale).pages.landscapeContent.showingFirst({ count: numPages }) })] }))] }), _jsx(PageList, { limit: numPages, ...listProps })] })] }));
                    }) })] }));
    }
    else {
        const pages = allPagesWithLandscape(landscape);
        const listProps = {
            ...props,
            allFiles: pages,
        };
        return (_jsxs("div", { class: classes, children: [_jsx("article", { children: content }), _jsxs("div", { class: "page-listing", children: [_jsx("p", { children: i18n(cfg.locale).pages.landscapeContent.itemsUnderTag({ count: pages.length }) }), _jsx("div", { children: _jsx(PageList, { ...listProps }) })] })] }));
    }
};
LandscapeContent.css = style + PageList.css;
export default (() => LandscapeContent);
