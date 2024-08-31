import { jsx as _jsx } from "preact/jsx-runtime";
import { htmlToJsx } from "../../util/jsx";
const Content = ({ fileData, tree }) => {
    const content = htmlToJsx(fileData.filePath, tree);
    const classes = fileData.frontmatter?.cssclasses ?? [];
    const classString = ["popover-hint", ...classes].join(" ");
    return _jsx("article", { class: classString, children: content });
};
export default (() => Content);
