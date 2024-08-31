import { jsx as _jsx } from "preact/jsx-runtime";
function SiteLogo({ cfg, fileData }) {
    const ogImagePath = `/static/qg-image.webp`;
    return _jsx("div", { children: _jsx("a", { href: "/", children: _jsx("img", { class: "site-logo", src: ogImagePath, alt: "Return to Home Page" }) }) });
}
SiteLogo.css = `
.site-logo {
  margin: 1rem 1rem 0 0;
  text-align: centre;
}
`;
export default (() => SiteLogo);
