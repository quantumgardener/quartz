export function registerEscapeHandler(outsideContainer, cb) {
    if (!outsideContainer)
        return;
    function click(e) {
        if (e.target !== this)
            return;
        e.preventDefault();
        e.stopPropagation();
        cb();
    }
    function esc(e) {
        if (!e.key.startsWith("Esc"))
            return;
        e.preventDefault();
        cb();
    }
    outsideContainer?.addEventListener("click", click);
    window.addCleanup(() => outsideContainer?.removeEventListener("click", click));
    document.addEventListener("keydown", esc);
    window.addCleanup(() => document.removeEventListener("keydown", esc));
}
export function removeAllChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
