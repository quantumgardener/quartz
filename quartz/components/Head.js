import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { i18n } from "../i18n";
import { joinSegments, pathToRoot } from "../util/path";
import { JSResourceToScriptElement } from "../util/resources";
import { googleFontHref } from "../util/theme";
export default (() => {
    const Head = ({ cfg, fileData, externalResources }) => {
        const title = fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title;
        const description = fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description;
        const { css, js } = externalResources;
        const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`);
        const path = url.pathname;
        const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug);
        const iconPath = joinSegments(baseDir, "static/icon.png");
        const ogImagePath = `https://${cfg.baseUrl}/static/qg-image.webp`;
        return (_jsxs("head", { children: [_jsx("title", { children: title }), _jsx("meta", { charSet: "utf-8" }), cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (_jsxs(_Fragment, { children: [_jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }), _jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com" }), _jsx("link", { rel: "stylesheet", href: googleFontHref(cfg.theme) })] })), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }), _jsx("meta", { property: "og:title", content: title }), _jsx("meta", { property: "og:description", content: description }), cfg.baseUrl && _jsx("meta", { property: "og:image", content: ogImagePath }), _jsx("meta", { property: "og:width", content: "1200" }), _jsx("meta", { property: "og:height", content: "675" }), _jsx("link", { rel: "icon", href: iconPath }), _jsx("meta", { name: "description", content: description }), _jsx("meta", { name: "generator", content: "Quartz" }), _jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }), _jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com" }), _jsx("link", { rel: "alternate", type: "application/rss+xml", title: "The Quantum Garden", href: "https://quantumgardener.info/feed/" }), css.map((href) => (_jsx("link", { href: href, rel: "stylesheet", type: "text/css" }, href))), js
                    .filter((resource) => resource.loadTime === "beforeDOMReady")
                    .map((res) => JSResourceToScriptElement(res, true)), _jsx("script", { src: "https://kit.fontawesome.com/5428a1cc8b.js", crossOrigin: "anonymous" })] }));
    };
    return Head;
});
