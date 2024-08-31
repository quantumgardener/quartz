import { jsx as _jsx } from "preact/jsx-runtime";
import { classNames } from "../util/lang";
// @ts-ignore
import script from "./scripts/comments.inline";
function boolToStringBool(b) {
    return b ? "1" : "0";
}
export default ((opts) => {
    const Comments = ({ displayClass, cfg }) => {
        return (_jsx("div", { class: classNames(displayClass, "giscus"), "data-repo": opts.options.repo, "data-repo-id": opts.options.repoId, "data-category": opts.options.category, "data-category-id": opts.options.categoryId, "data-mapping": opts.options.mapping ?? "url", "data-strict": boolToStringBool(opts.options.strict ?? true), "data-reactions-enabled": boolToStringBool(opts.options.reactionsEnabled ?? true), "data-input-position": opts.options.inputPosition ?? "bottom" }));
    };
    Comments.afterDOMLoaded = script;
    return Comments;
});
