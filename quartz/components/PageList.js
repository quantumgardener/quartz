import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { resolveRelative } from "../util/path";
import { getDate, formatDate } from "./Date";
export function byDateAndAlphabetical(cfg) {
    return (f1, f2) => {
        if (f1.dates && f2.dates) {
            // sort descending
            return getDate(cfg, f2).getTime() - getDate(cfg, f1).getTime();
        }
        else if (f1.dates && !f2.dates) {
            // prioritize files with dates
            return -1;
        }
        else if (!f1.dates && f2.dates) {
            return 1;
        }
        // otherwise, sort lexographically by title
        const f1Title = f1.frontmatter?.title.toLowerCase() ?? "";
        const f2Title = f2.frontmatter?.title.toLowerCase() ?? "";
        return f1Title.localeCompare(f2Title);
    };
}
export const PageList = ({ cfg, fileData, allFiles, limit, sort }) => {
    const sorter = sort ?? byDateAndAlphabetical(cfg);
    let list = allFiles.sort(sorter);
    if (limit) {
        list = list.slice(0, limit);
    }
    return (_jsx("ul", { class: "section-ul", children: list.map((page) => {
            console.log(page.frontmatter?.title, allFiles.length);
            let pagedate = "";
            if (page.dates) {
                pagedate = formatDate(getDate(cfg, page), cfg.locale);
            }
            const title = page.frontmatter?.title;
            const tags = page.frontmatter?.tags ?? [];
            const description = page.description;
            const matches = fileData.slug.match(new RegExp("\/", "g"));
            const leaf = !fileData.slug.startsWith("blog") || matches.length >= 3;
            return (_jsxs("li", { class: "section-li", children: [_jsx("hr", {}), _jsxs("div", { class: "desc", children: [leaf && (_jsx("div", { style: "float:right", children: _jsx("small", { children: pagedate }) })), _jsx("h3", { children: _jsx("a", { href: resolveRelative(fileData.slug, page.slug), class: "internal", children: title }) }), _jsx("p", { children: description })] })] }));
        }) }));
};
PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`;
