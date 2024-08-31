let currentExplorerState;
const observer = new IntersectionObserver((entries) => {
    // If last element is observed, remove gradient of "overflow" class so element is visible
    const explorerUl = document.getElementById("explorer-ul");
    if (!explorerUl)
        return;
    for (const entry of entries) {
        if (entry.isIntersecting) {
            explorerUl.classList.add("no-background");
        }
        else {
            explorerUl.classList.remove("no-background");
        }
    }
});
function toggleExplorer() {
    this.classList.toggle("collapsed");
    this.setAttribute("aria-expanded", this.getAttribute("aria-expanded") === "true" ? "false" : "true");
    const content = this.nextElementSibling;
    if (!content)
        return;
    content.classList.toggle("collapsed");
    content.style.maxHeight = content.style.maxHeight === "0px" ? content.scrollHeight + "px" : "0px";
}
function toggleFolder(evt) {
    evt.stopPropagation();
    const target = evt.target;
    if (!target)
        return;
    const isSvg = target.nodeName === "svg";
    const childFolderContainer = (isSvg
        ? target.parentElement?.nextSibling
        : target.parentElement?.parentElement?.nextElementSibling);
    const currentFolderParent = (isSvg ? target.nextElementSibling : target.parentElement);
    if (!(childFolderContainer && currentFolderParent))
        return;
    childFolderContainer.classList.toggle("open");
    const isCollapsed = childFolderContainer.classList.contains("open");
    setFolderState(childFolderContainer, !isCollapsed);
    const fullFolderPath = currentFolderParent.dataset.folderpath;
    toggleCollapsedByPath(currentExplorerState, fullFolderPath);
    const stringifiedFileTree = JSON.stringify(currentExplorerState);
    localStorage.setItem("fileTree", stringifiedFileTree);
}
function setupExplorer() {
    const explorer = document.getElementById("explorer");
    if (!explorer)
        return;
    if (explorer.dataset.behavior === "collapse") {
        for (const item of document.getElementsByClassName("folder-button")) {
            item.addEventListener("click", toggleFolder);
            window.addCleanup(() => item.removeEventListener("click", toggleFolder));
        }
    }
    explorer.addEventListener("click", toggleExplorer);
    window.addCleanup(() => explorer.removeEventListener("click", toggleExplorer));
    // Set up click handlers for each folder (click handler on folder "icon")
    for (const item of document.getElementsByClassName("folder-icon")) {
        item.addEventListener("click", toggleFolder);
        window.addCleanup(() => item.removeEventListener("click", toggleFolder));
    }
    // Get folder state from local storage
    const storageTree = localStorage.getItem("fileTree");
    const useSavedFolderState = explorer?.dataset.savestate === "true";
    const oldExplorerState = storageTree && useSavedFolderState ? JSON.parse(storageTree) : [];
    const oldIndex = new Map(oldExplorerState.map((entry) => [entry.path, entry.collapsed]));
    const newExplorerState = explorer.dataset.tree
        ? JSON.parse(explorer.dataset.tree)
        : [];
    currentExplorerState = [];
    for (const { path, collapsed } of newExplorerState) {
        currentExplorerState.push({ path, collapsed: oldIndex.get(path) ?? collapsed });
    }
    currentExplorerState.map((folderState) => {
        const folderLi = document.querySelector(`[data-folderpath='${folderState.path}']`);
        const folderUl = folderLi?.parentElement?.nextElementSibling;
        if (folderUl) {
            setFolderState(folderUl, folderState.collapsed);
        }
    });
}
window.addEventListener("resize", setupExplorer);
document.addEventListener("nav", () => {
    setupExplorer();
    observer.disconnect();
    // select pseudo element at end of list
    const lastItem = document.getElementById("explorer-end");
    if (lastItem) {
        observer.observe(lastItem);
    }
});
/**
 * Toggles the state of a given folder
 * @param folderElement <div class="folder-outer"> Element of folder (parent)
 * @param collapsed if folder should be set to collapsed or not
 */
function setFolderState(folderElement, collapsed) {
    return collapsed ? folderElement.classList.remove("open") : folderElement.classList.add("open");
}
/**
 * Toggles visibility of a folder
 * @param array array of FolderState (`fileTree`, either get from local storage or data attribute)
 * @param path path to folder (e.g. 'advanced/more/more2')
 */
function toggleCollapsedByPath(array, path) {
    const entry = array.find((item) => item.path === path);
    if (entry) {
        entry.collapsed = !entry.collapsed;
    }
}
export {};
