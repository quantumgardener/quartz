import { jsx as _jsx } from "preact/jsx-runtime";
import { pathToRoot } from "../util/path";
import { classNames } from "../util/lang";
function PageTitle({ fileData, cfg, displayClass }) {
    const title = cfg?.pageTitle ?? "Untitled Quartz";
    const baseDir = new URL(`https://${cfg.baseUrl ?? pathToRoot(fileData.slug)}`);
    return (_jsx("h1", { class: classNames(displayClass, "page-title"), children: _jsx("a", { href: "/", children: title }) }));
}
PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
}
`;
export default (() => PageTitle);
