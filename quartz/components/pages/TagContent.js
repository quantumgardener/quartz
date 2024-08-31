import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "../styles/listPage.scss";
import { PageList } from "../PageList";
import { getAllSegmentPrefixes, simplifySlug } from "../../util/path";
import { htmlToJsx } from "../../util/jsx";
import { i18n } from "../../i18n";
const defaultOptions = {
    numPages: 10,
};
export default ((opts) => {
    const options = { ...defaultOptions, ...opts };
    const TagContent = (props) => {
        const { tree, fileData, allFiles, cfg } = props;
        const slug = fileData.slug;
        if (!(slug?.startsWith("topics/") || slug === "topics")) {
            throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`);
        }
        const tag = simplifySlug(slug.slice("topics/".length));
        const allPagesWithTag = (tag) => allFiles.filter((file) => (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes).includes(tag));
        const content = tree.children.length === 0
            ? fileData.description
            : htmlToJsx(fileData.filePath, tree);
        const cssClasses = fileData.frontmatter?.cssclasses ?? [];
        const classes = ["popover-hint", ...cssClasses].join(" ");
        if (tag === "/") {
            const tags = [
                ...new Set(allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes)),
            ].sort((a, b) => a.localeCompare(b));
            const tagItemMap = new Map();
            for (const tag of tags) {
                tagItemMap.set(tag, allPagesWithTag(tag));
            }
            return (_jsxs("div", { class: classes, children: [_jsx("article", { children: _jsx("p", { children: content }) }), _jsx("p", { children: i18n(cfg.locale).pages.tagContent.totalTags({ count: tags.length }) }), _jsx("hr", {}), _jsx("div", { children: tags.map((tag) => {
                            const pages = tagItemMap.get(tag);
                            const listProps = {
                                ...props,
                                allFiles: pages,
                            };
                            const contentPage = allFiles.filter((file) => file.slug === `topics/${tag}`).at(0);
                            const root = contentPage?.htmlAst;
                            const content = !root || root?.children.length === 0
                                ? contentPage?.description
                                : htmlToJsx(contentPage.filePath, root);
                            return (_jsxs("div", { children: [_jsx("h2", { children: _jsx("a", { class: "internal tag-link", href: `../topics/${tag}`, children: tag }) }), content && _jsx("p", { children: content }), _jsxs("div", { class: "page-listing", children: [_jsxs("p", { children: [i18n(cfg.locale).pages.tagContent.itemsUnderTag({ count: pages.length }), pages.length > options.numPages && (_jsxs(_Fragment, { children: [" ", _jsx("span", { children: i18n(cfg.locale).pages.tagContent.showingFirst({ count: options.numPages }) })] }))] }), _jsx(PageList, { limit: options.numPages, ...listProps })] })] }));
                        }) })] }));
        }
        else {
            const pages = allPagesWithTag(tag);
            const listProps = {
                ...props,
                allFiles: pages,
            };
            return (_jsxs("div", { class: classes, children: [_jsx("article", { children: content }), _jsxs("div", { class: "page-listing", children: [_jsx("p", { children: i18n(cfg.locale).pages.tagContent.itemsUnderTag({ count: pages.length }) }), _jsx("div", { children: _jsx(PageList, { ...listProps }) })] })] }));
        }
    };
    TagContent.css = style + PageList.css;
    return TagContent;
});
