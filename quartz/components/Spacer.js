import { jsx as _jsx } from "preact/jsx-runtime";
import { classNames } from "../util/lang";
function Spacer({ displayClass }) {
    return _jsx("div", { class: classNames(displayClass, "spacer") });
}
export default (() => Spacer);
