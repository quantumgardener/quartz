import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import Slugger from "github-slugger";
const defaultOptions = {
    maxDepth: 3,
    minEntries: 1,
    showByDefault: true,
    collapseByDefault: false,
};
const slugAnchor = new Slugger();
export const TableOfContents = (userOpts) => {
    const opts = { ...defaultOptions, ...userOpts };
    return {
        name: "TableOfContents",
        markdownPlugins() {
            return [
                () => {
                    return async (tree, file) => {
                        const display = file.data.frontmatter?.enableToc ?? opts.showByDefault;
                        if (display) {
                            slugAnchor.reset();
                            const toc = [];
                            let highestDepth = opts.maxDepth;
                            visit(tree, "heading", (node) => {
                                if (node.depth <= opts.maxDepth) {
                                    const text = toString(node);
                                    highestDepth = Math.min(highestDepth, node.depth);
                                    toc.push({
                                        depth: node.depth,
                                        text,
                                        slug: slugAnchor.slug(text),
                                    });
                                }
                            });
                            if (toc.length > 0 && toc.length > opts.minEntries) {
                                file.data.toc = toc.map((entry) => ({
                                    ...entry,
                                    depth: entry.depth - highestDepth,
                                }));
                                file.data.collapseToc = opts.collapseByDefault;
                            }
                        }
                    };
                },
            ];
        },
    };
};
