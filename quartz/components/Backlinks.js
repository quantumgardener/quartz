import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "./styles/backlinks.scss";
import { resolveRelative, simplifySlug } from "../util/path";
import { i18n } from "../i18n";
import { classNames } from "../util/lang";
// @ts-ignore
import script from "./scripts/backlinks.inline";
const Backlinks = ({ fileData, allFiles, displayClass, cfg, }) => {
    const slug = simplifySlug(fileData.slug);
    const backlinkFiles = allFiles.filter((file) => file.links?.includes(slug) && file.slug != "404");
    return (_jsxs("div", { class: classNames(displayClass, "backlinks"), children: [_jsxs("button", { type: "button", id: "backlinks", class: fileData.collapseToc ? "collapsed" : "", children: [_jsxs("h3", { children: [i18n(cfg.locale).components.backlinks.title, " ", _jsx("a", { href: "/notes/backlinks", style: "color:var(--secondary)", children: _jsx("i", { class: "fa-solid fa-circle-question" }) })] }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "fold", children: _jsx("polyline", { points: "6 9 12 15 18 9" }) })] }), _jsx("div", { id: "backlinks-content", children: _jsx("ul", { class: "overflow", children: backlinkFiles.length > 0 ? (backlinkFiles.map((f) => (_jsx("li", { children: _jsx("a", { href: resolveRelative(fileData.slug, f.slug), class: "internal", children: f.frontmatter?.title }) })))) : (_jsx("li", { children: i18n(cfg.locale).components.backlinks.noBacklinksFound })) }) })] }));
};
Backlinks.css = style;
Backlinks.afterDOMLoaded = script;
export default (() => Backlinks);
