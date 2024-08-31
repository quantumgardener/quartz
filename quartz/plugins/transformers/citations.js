import rehypeCitation from "rehype-citation";
import { visit } from "unist-util-visit";
const defaultOptions = {
    bibliographyFile: "./bibliography.bib",
    suppressBibliography: false,
    linkCitations: false,
    csl: "apa",
};
export const Citations = (userOpts) => {
    const opts = { ...defaultOptions, ...userOpts };
    return {
        name: "Citations",
        htmlPlugins() {
            const plugins = [];
            // Add rehype-citation to the list of plugins
            plugins.push([
                rehypeCitation,
                {
                    bibliography: opts.bibliographyFile,
                    suppressBibliography: opts.suppressBibliography,
                    linkCitations: opts.linkCitations,
                },
            ]);
            // Transform the HTML of the citattions; add data-no-popover property to the citation links
            // using https://github.com/syntax-tree/unist-util-visit as they're just anochor links
            plugins.push(() => {
                return (tree, _file) => {
                    visit(tree, "element", (node, _index, _parent) => {
                        if (node.tagName === "a" && node.properties?.href?.startsWith("#bib")) {
                            node.properties["data-no-popover"] = true;
                        }
                    });
                };
            });
            return plugins;
        },
    };
};
