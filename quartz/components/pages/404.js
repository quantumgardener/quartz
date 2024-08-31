import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
const NotFound = ({ cfg }) => {
    // If baseUrl contains a pathname after the domain, use this as the home link
    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`);
    const baseDir = url.pathname;
    return (_jsxs("article", { class: "popover-hint", children: [_jsx("p", { children: "Sadly, the page you are looking for can't be found. There can be several reasons for this." }), _jsxs("ul", { children: [_jsx("li", { children: "The page doesn't exist and never has." }), _jsx("li", { children: "Content has not yet migrated across from an earlier version of the website." }), _jsx("li", { children: "Something was typed incorrectly." })] }), _jsxs("p", { children: ["Please return to the ", _jsx("a", { href: "/", children: "Home page" }), " or use the ", _jsx("strong", { children: "Search box" }), " to find what you are seeking."] })] }));
};
export default (() => NotFound);
