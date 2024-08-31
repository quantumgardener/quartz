import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { joinSegments, resolveRelative, clone, simplifySlug, } from "../util/path";
function getPathSegment(fp, idx) {
    if (!fp) {
        return undefined;
    }
    return fp.split("/").at(idx);
}
// Structure to add all files into a tree
export class FileNode {
    children;
    name; // this is the slug segment
    displayName;
    file;
    depth;
    constructor(slugSegment, displayName, file, depth) {
        this.children = [];
        this.name = slugSegment;
        this.displayName = displayName ?? file?.frontmatter?.title ?? slugSegment;
        this.file = file ? clone(file) : null;
        this.depth = depth ?? 0;
    }
    insert(fileData) {
        if (fileData.path.length === 0) {
            return;
        }
        const nextSegment = fileData.path[0];
        // base case, insert here
        if (fileData.path.length === 1) {
            if (nextSegment === "") {
                // index case (we are the root and we just found index.md), set our data appropriately
                const title = fileData.file.frontmatter?.title;
                if (title && title !== "index") {
                    this.displayName = title;
                }
            }
            else {
                // direct child
                this.children.push(new FileNode(nextSegment, undefined, fileData.file, this.depth + 1));
            }
            return;
        }
        // find the right child to insert into
        fileData.path = fileData.path.splice(1);
        const child = this.children.find((c) => c.name === nextSegment);
        if (child) {
            child.insert(fileData);
            return;
        }
        const newChild = new FileNode(nextSegment, getPathSegment(fileData.file.relativePath, this.depth), undefined, this.depth + 1);
        newChild.insert(fileData);
        this.children.push(newChild);
    }
    // Add new file to tree
    add(file) {
        this.insert({ file: file, path: simplifySlug(file.slug).split("/") });
    }
    /**
     * Filter FileNode tree. Behaves similar to `Array.prototype.filter()`, but modifies tree in place
     * @param filterFn function to filter tree with
     */
    filter(filterFn) {
        this.children = this.children.filter(filterFn);
        this.children.forEach((child) => child.filter(filterFn));
    }
    /**
     * Filter FileNode tree. Behaves similar to `Array.prototype.map()`, but modifies tree in place
     * @param mapFn function to use for mapping over tree
     */
    map(mapFn) {
        mapFn(this);
        this.children.forEach((child) => child.map(mapFn));
    }
    /**
     * Get folder representation with state of tree.
     * Intended to only be called on root node before changes to the tree are made
     * @param collapsed default state of folders (collapsed by default or not)
     * @returns array containing folder state for tree
     */
    getFolderPaths(collapsed) {
        const folderPaths = [];
        const traverse = (node, currentPath) => {
            if (!node.file) {
                const folderPath = joinSegments(currentPath, node.name);
                if (folderPath !== "") {
                    folderPaths.push({ path: folderPath, collapsed });
                }
                node.children.forEach((child) => traverse(child, folderPath));
            }
        };
        traverse(this, "");
        return folderPaths;
    }
    // Sort order: folders first, then files. Sort folders and files alphabetically
    /**
     * Sorts tree according to sort/compare function
     * @param sortFn compare function used for `.sort()`, also used recursively for children
     */
    sort(sortFn) {
        this.children = this.children.sort(sortFn);
        this.children.forEach((e) => e.sort(sortFn));
    }
}
export function ExplorerNode({ node, opts, fullPath, fileData }) {
    // Get options
    const folderBehavior = opts.folderClickBehavior;
    const isDefaultOpen = opts.folderDefaultState === "open";
    // Calculate current folderPath
    const folderPath = node.name !== "" ? joinSegments(fullPath ?? "", node.name) : "";
    const href = resolveRelative(fileData.slug, folderPath) + "/";
    return (_jsx(_Fragment, { children: node.file ? (
        // Single file node
        _jsx("li", { children: _jsx("a", { href: resolveRelative(fileData.slug, node.file.slug), "data-for": node.file.slug, children: node.displayName }) }, node.file.slug)) : (_jsxs("li", { children: [node.name !== "" && (
                // Node with entire folder
                // Render svg button + folder name, then children
                _jsxs("div", { class: "folder-container", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "12", height: "12", viewBox: "5 8 14 8", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", class: "folder-icon", children: _jsx("polyline", { points: "6 9 12 15 18 9" }) }), _jsx("div", { "data-folderpath": folderPath, children: folderBehavior === "link" ? (_jsx("a", { href: href, "data-for": node.name, class: "folder-title", children: node.displayName })) : (_jsx("button", { class: "folder-button", children: _jsx("span", { class: "folder-title", children: node.displayName }) })) }, node.name)] })), _jsx("div", { class: `folder-outer ${node.depth === 0 || isDefaultOpen ? "open" : ""}`, children: _jsx("ul", { 
                        // Inline style for left folder paddings
                        style: {
                            paddingLeft: node.name !== "" ? "1.4rem" : "0",
                        }, class: "content", "data-folderul": folderPath, children: node.children.map((childNode, i) => (_jsx(ExplorerNode, { node: childNode, opts: opts, fullPath: folderPath, fileData: fileData }, i))) }) })] })) }));
}
