import { getFullSlug } from "../../util/path";
const checkboxId = (index) => `${getFullSlug(window)}-checkbox-${index}`;
document.addEventListener("nav", () => {
    const checkboxes = document.querySelectorAll("input.checkbox-toggle");
    checkboxes.forEach((el, index) => {
        const elId = checkboxId(index);
        const switchState = (e) => {
            const newCheckboxState = e.target?.checked ? "true" : "false";
            localStorage.setItem(elId, newCheckboxState);
        };
        el.addEventListener("change", switchState);
        window.addCleanup(() => el.removeEventListener("change", switchState));
        if (localStorage.getItem(elId) === "true") {
            el.checked = true;
        }
    });
});
