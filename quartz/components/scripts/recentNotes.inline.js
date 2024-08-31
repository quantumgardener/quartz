"use strict";
function toggleRecentNotes() {
    const collapsed = this.classList.toggle("collapsed");
    const content = this.nextElementSibling;
    if (!content)
        return;
    content.classList.toggle("collapsed");
    content.style.maxHeight = content.style.maxHeight === "0px" ? content.scrollHeight + "px" : "0px";
    content.style.overflow = collapsed ? "hidden" : "visible";
}
function setupRecentNotes() {
    const recentnotes = document.getElementById("recent-notes");
    if (recentnotes) {
        const collapsed = recentnotes.classList.contains("collapsed");
        const content = recentnotes.nextElementSibling;
        if (!content)
            return;
        content.style.maxHeight = collapsed ? "0px" : content.scrollHeight + "px";
        recentnotes.addEventListener("click", toggleRecentNotes);
        window.addCleanup(() => recentnotes.removeEventListener("click", toggleRecentNotes));
    }
}
window.addEventListener("resize", setupRecentNotes);
document.addEventListener("nav", () => {
    setupRecentNotes();
});
