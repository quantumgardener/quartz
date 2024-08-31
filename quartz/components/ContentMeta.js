import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { formatDate, getDate } from "./Date";
import readingTime from "reading-time";
import { classNames } from "../util/lang";
import { i18n } from "../i18n";
import style from "./styles/contentMeta.scss";
const defaultOptions = {
    showReadingTime: true,
    showComma: true,
    showDate: true,
    showLandscapes: true,
};
function landscapeHTML(landscape, title) {
    const url = `/landscapes/${landscape}`;
    return (_jsx("span", { children: _jsxs("a", { class: "internal tag-link", href: url, children: [_jsx("i", { style: "color:#5C4033", class: "fa-solid fa-mountain-sun" }), " ", title] }) }));
}
export default ((opts) => {
    // Merge options with defaults
    const options = { ...defaultOptions, ...opts };
    function ContentMetadata({ cfg, fileData, displayClass, allFiles }) {
        const text = fileData.text;
        if (text) {
            const segments = [];
            if (fileData.dates && options.showDate) {
                const created = formatDate(getDate(cfg, fileData), cfg.locale);
                const modifed = formatDate(fileData.dates?.modified, cfg.locale);
                if (created == modifed) {
                    segments.push(`${created},`);
                }
                else {
                    segments.push(`${created} [updated ${modifed}],`);
                }
            }
            // Display reading time if enabled
            if (options.showReadingTime) {
                const { minutes, words: _words } = readingTime(text);
                const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
                    minutes: Math.ceil(minutes),
                });
                segments.push(displayedTime);
            }
            if (options.showLandscapes) {
                if (fileData.frontmatter?.landscapes != null) {
                    for (const landscape of fileData.frontmatter?.landscapes) {
                        const result = allFiles.find(item => item.slug === `landscapes/${landscape}`);
                        segments.push(landscapeHTML(landscape, result?.frontmatter?.title.toUpperCase()));
                    }
                }
            }
            // End of my changes
            const segmentsElements = segments.map((segment) => _jsx("span", { children: segment }));
            return (_jsx("p", { "show-comma": options.showComma, class: classNames(displayClass, "content-meta"), children: segmentsElements }));
        }
        else {
            return null;
        }
    }
    ContentMetadata.css = style;
    return ContentMetadata;
});
