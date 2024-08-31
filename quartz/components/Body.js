import { jsx as _jsx } from "preact/jsx-runtime";
// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline";
import clipboardStyle from "./styles/clipboard.scss";
const Body = ({ children }) => {
    return _jsx("div", { id: "quartz-body", children: children });
};
Body.afterDOMLoaded = clipboardScript;
Body.css = clipboardStyle;
export default (() => Body);
