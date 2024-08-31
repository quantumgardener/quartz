"use strict";
function toggleBacklinks() {
    const collapsed = this.classList.toggle("collapsed");
    const content = this.nextElementSibling;
    if (!content)
        return;
    content.classList.toggle("collapsed");
    content.style.maxHeight = content.style.maxHeight === "0px" ? content.scrollHeight + "px" : "0px";
    content.style.overflow = collapsed ? "hidden" : "visible";
}
function setupBacklinks() {
    const backlinks = document.getElementById("backlinks");
    if (backlinks) {
        const collapsed = backlinks.classList.contains("collapsed");
        const content = backlinks.nextElementSibling;
        if (!content)
            return;
        content.style.maxHeight = collapsed ? "0px" : content.scrollHeight + "px";
        backlinks.addEventListener("click", toggleBacklinks);
        window.addCleanup(() => backlinks.removeEventListener("click", toggleBacklinks));
    }
}
window.addEventListener("resize", setupBacklinks);
document.addEventListener("nav", () => {
    setupBacklinks();
});
