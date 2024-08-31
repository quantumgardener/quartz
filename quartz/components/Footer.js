import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import style from "./styles/footer.scss";
export default ((opts) => {
    const Footer = ({ cfg, allFiles, displayClass }) => {
        const today = new Date();
        const localYear = today.toLocaleString(cfg.locale, {
            timeZone: cfg.timezone,
            year: 'numeric',
        });
        const localToday = today.toLocaleString(cfg.locale, {
            timeZone: cfg.timezone,
            dateStyle: "long",
            timeStyle: "short"
        });
        const links = opts?.links ?? [];
        return (_jsxs("footer", { class: `${displayClass ?? ""}`, children: [_jsx("button", { class: "tinylytics_kudos" }), _jsx("hr", {}), _jsxs("ul", { children: [_jsx("li", { children: _jsxs("a", { href: "/notes/about", children: [_jsx("i", { class: "fa-solid fa-address-card" }), " About"] }) }), _jsx("li", { children: _jsxs("a", { href: "/privacy", children: [_jsx("i", { class: "fa-solid fa-lock" }), " Privacy"] }) }), _jsx("li", { children: "|" }), Object.entries(links).map(([text, detail]) => {
                            const fontclass = detail.icon;
                            return (_jsx("li", { children: _jsxs("a", { href: detail.link, children: [_jsx("i", { class: fontclass }), " ", text] }) }));
                        })] }), _jsxs("div", { class: "site-metadata", children: [_jsx("i", { class: "fa-regular fa-copyright" }), " David C. Buchan 2002\u2013", localYear, ". Created with ", _jsx("a", { href: "https://obsidian.md", children: "Obsidian" }), " and ", _jsx("a", { href: "https://quartz.jzhao.xyz/", children: "Quartz" }), ". ", _jsx("a", { rel: "me", href: "https://aus.social/@dcbuchan" }), _jsx("br", {}), "Site pages: ", allFiles.length, ". Last update: ", localToday, ". ", _jsx("a", { href: "/recent", children: "Recently updated notes" }), ".", _jsx("br", {}), _jsx("a", { href: "/total-unique-visitors", children: "Total unique visitors" }), ": ", _jsx("span", { class: "tinylytics_hits" }), " from ", _jsx("span", { class: "tinylytics_countries flags" })] })] }));
    };
    Footer.css = style;
    return Footer;
});
