import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import explorerStyle from "./styles/explorer.scss";
// @ts-ignore
import script from "./scripts/explorer.inline";
import { ExplorerNode, FileNode } from "./ExplorerNode";
import { classNames } from "../util/lang";
import { i18n } from "../i18n";
// Options interface defined in `ExplorerNode` to avoid circular dependency
const defaultOptions = {
    folderClickBehavior: "collapse",
    folderDefaultState: "collapsed",
    useSavedState: true,
    mapFn: (node) => {
        return node;
    },
    sortFn: (a, b) => {
        // Sort order: folders first, then files. Sort folders and files alphabetically
        if ((!a.file && !b.file) || (a.file && b.file)) {
            // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
            // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
            return a.displayName.localeCompare(b.displayName, undefined, {
                numeric: true,
                sensitivity: "base",
            });
        }
        if (a.file && !b.file) {
            return 1;
        }
        else {
            return -1;
        }
    },
    filterFn: (node) => node.name !== "topics",
    order: ["filter", "map", "sort"],
};
export default ((userOpts) => {
    // Parse config
    const opts = { ...defaultOptions, ...userOpts };
    // memoized
    let fileTree;
    let jsonTree;
    let lastBuildId = "";
    function constructFileTree(allFiles) {
        // Construct tree from allFiles
        fileTree = new FileNode("");
        allFiles.forEach((file) => fileTree.add(file));
        // Execute all functions (sort, filter, map) that were provided (if none were provided, only default "sort" is applied)
        if (opts.order) {
            // Order is important, use loop with index instead of order.map()
            for (let i = 0; i < opts.order.length; i++) {
                const functionName = opts.order[i];
                if (functionName === "map") {
                    fileTree.map(opts.mapFn);
                }
                else if (functionName === "sort") {
                    fileTree.sort(opts.sortFn);
                }
                else if (functionName === "filter") {
                    fileTree.filter(opts.filterFn);
                }
            }
        }
        // Get all folders of tree. Initialize with collapsed state
        // Stringify to pass json tree as data attribute ([data-tree])
        const folders = fileTree.getFolderPaths(opts.folderDefaultState === "collapsed");
        jsonTree = JSON.stringify(folders);
    }
    const Explorer = ({ ctx, cfg, allFiles, displayClass, fileData, }) => {
        if (ctx.buildId !== lastBuildId) {
            lastBuildId = ctx.buildId;
            constructFileTree(allFiles);
        }
        return (_jsxs("div", { class: classNames(displayClass, "explorer"), children: [_jsxs("button", { type: "button", id: "explorer", "data-behavior": opts.folderClickBehavior, "data-collapsed": opts.folderDefaultState, "data-savestate": opts.useSavedState, "data-tree": jsonTree, "aria-controls": "explorer-content", "aria-expanded": opts.folderDefaultState === "open", children: [_jsx("h2", { children: opts.title ?? i18n(cfg.locale).components.explorer.title }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "5 8 14 8", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "fold", children: _jsx("polyline", { points: "6 9 12 15 18 9" }) })] }), _jsx("div", { id: "explorer-content", children: _jsxs("ul", { class: "overflow", id: "explorer-ul", children: [_jsx(ExplorerNode, { node: fileTree, opts: opts, fileData: fileData }), _jsx("li", { id: "explorer-end" })] }) })] }));
    };
    Explorer.css = explorerStyle;
    Explorer.afterDOMLoaded = script;
    return Explorer;
});
