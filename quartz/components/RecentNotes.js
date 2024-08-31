import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { resolveRelative } from "../util/path";
import { byDateAndAlphabetical } from "./PageList";
import style from "./styles/recentNotes.scss";
import { Date, getDate } from "./Date";
import { i18n } from "../i18n";
import { classNames } from "../util/lang";
// @ts-ignore
import script from "./scripts/recentNotes.inline";
const defaultOptions = (cfg) => ({
    limit: 3,
    linkToMore: false,
    showTags: true,
    filter: () => true,
    sort: byDateAndAlphabetical(cfg),
});
export default ((userOpts) => {
    const RecentNotes = ({ allFiles, fileData, displayClass, cfg, }) => {
        const opts = { ...defaultOptions(cfg), ...userOpts };
        const pages = allFiles.filter(opts.filter).sort(opts.sort);
        const remaining = Math.max(0, pages.length - opts.limit);
        return (_jsxs("div", { class: classNames(displayClass, "recent-notes"), children: [_jsxs("button", { type: "button", id: "recent-notes", class: fileData.collapseToc ? "collapsed" : "", children: [_jsxs("h3", { children: [opts.title ?? i18n(cfg.locale).components.recentNotes.title, " ", _jsx("a", { href: "https://quantumgardener.info/feed", style: "color:var(--secondary)", children: _jsx("i", { class: "fa-solid fa-square-rss" }) })] }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "fold", children: _jsx("polyline", { points: "6 9 12 15 18 9" }) })] }), _jsxs("div", { id: "recent-notes-content", children: [_jsx("ul", { class: "overflow", children: pages.slice(0, opts.limit).map((page) => {
                                const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title;
                                const tags = page.frontmatter?.tags ?? [];
                                return (_jsxs("li", { children: [_jsx("a", { href: resolveRelative(fileData.slug, page.slug), class: "internal", children: title }), _jsx("br", {}), page.dates && (_jsx("span", { class: "meta", children: _jsx(Date, { date: getDate(cfg, page), locale: cfg.locale }) }))] }));
                            }) }), _jsx("a", { href: "/blog", children: "Read more\u2026" }), opts.linkToMore && remaining > 0 && (_jsx("p", { children: _jsx("a", { href: resolveRelative(fileData.slug, opts.linkToMore), children: i18n(cfg.locale).components.recentNotes.seeRemainingMore({ remaining }) }) }))] })] }));
    };
    RecentNotes.css = style;
    RecentNotes.afterDOMLoaded = script;
    return RecentNotes;
});
