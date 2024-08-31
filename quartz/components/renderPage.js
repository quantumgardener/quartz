import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { render } from "preact-render-to-string";
import HeaderConstructor from "./Header";
import BodyConstructor from "./Body";
import { JSResourceToScriptElement } from "../util/resources";
import { clone, joinSegments, normalizeHastElement } from "../util/path";
import { visit } from "unist-util-visit";
import { i18n } from "../i18n";
const headerRegex = new RegExp(/h[1-6]/);
export function pageResources(baseDir, staticResources) {
    const contentIndexPath = joinSegments(baseDir, "static/contentIndex.json");
    const contentIndexScript = `const fetchData = fetch("${contentIndexPath}").then(data => data.json())`;
    return {
        css: [joinSegments(baseDir, "index.css"), ...staticResources.css],
        js: [
            {
                src: joinSegments(baseDir, "prescript.js"),
                loadTime: "beforeDOMReady",
                contentType: "external",
            },
            {
                loadTime: "beforeDOMReady",
                contentType: "inline",
                spaPreserve: true,
                script: contentIndexScript,
            },
            ...staticResources.js,
            {
                src: joinSegments(baseDir, "postscript.js"),
                loadTime: "afterDOMReady",
                moduleType: "module",
                contentType: "external",
            },
        ],
    };
}
export function renderPage(cfg, slug, componentData, components, pageResources) {
    // make a deep copy of the tree so we don't remove the transclusion references
    // for the file cached in contentMap in build.ts
    const root = clone(componentData.tree);
    // process transcludes in componentData
    visit(root, "element", (node, _index, _parent) => {
        if (node.tagName === "blockquote") {
            const classNames = (node.properties?.className ?? []);
            if (classNames.includes("transclude")) {
                const inner = node.children[0];
                const transcludeTarget = inner.properties["data-slug"];
                const page = componentData.allFiles.find((f) => f.slug === transcludeTarget);
                if (!page) {
                    return;
                }
                let blockRef = node.properties.dataBlock;
                if (blockRef?.startsWith("#^")) {
                    // block transclude
                    blockRef = blockRef.slice("#^".length);
                    let blockNode = page.blocks?.[blockRef];
                    if (blockNode) {
                        if (blockNode.tagName === "li") {
                            blockNode = {
                                type: "element",
                                tagName: "ul",
                                properties: {},
                                children: [blockNode],
                            };
                        }
                        node.children = [
                            normalizeHastElement(blockNode, slug, transcludeTarget),
                            {
                                type: "element",
                                tagName: "a",
                                properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
                                children: [
                                    { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
                                ],
                            },
                        ];
                    }
                }
                else if (blockRef?.startsWith("#") && page.htmlAst) {
                    // header transclude
                    blockRef = blockRef.slice(1);
                    let startIdx = undefined;
                    let startDepth = undefined;
                    let endIdx = undefined;
                    for (const [i, el] of page.htmlAst.children.entries()) {
                        // skip non-headers
                        if (!(el.type === "element" && el.tagName.match(headerRegex)))
                            continue;
                        const depth = Number(el.tagName.substring(1));
                        // lookin for our blockref
                        if (startIdx === undefined || startDepth === undefined) {
                            // skip until we find the blockref that matches
                            if (el.properties?.id === blockRef) {
                                startIdx = i;
                                startDepth = depth;
                            }
                        }
                        else if (depth <= startDepth) {
                            // looking for new header that is same level or higher
                            endIdx = i;
                            break;
                        }
                    }
                    if (startIdx === undefined) {
                        return;
                    }
                    node.children = [
                        ...page.htmlAst.children.slice(startIdx, endIdx).map((child) => normalizeHastElement(child, slug, transcludeTarget)),
                        {
                            type: "element",
                            tagName: "a",
                            properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
                            children: [
                                { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
                            ],
                        },
                    ];
                }
                else if (page.htmlAst) {
                    // page transclude
                    node.children = [
                        {
                            type: "element",
                            tagName: "h1",
                            properties: {},
                            children: [
                                {
                                    type: "text",
                                    value: page.frontmatter?.title ??
                                        i18n(cfg.locale).components.transcludes.transcludeOf({
                                            targetSlug: page.slug,
                                        }),
                                },
                            ],
                        },
                        ...page.htmlAst.children.map((child) => normalizeHastElement(child, slug, transcludeTarget)),
                        {
                            type: "element",
                            tagName: "a",
                            properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
                            children: [
                                { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
                            ],
                        },
                    ];
                }
            }
        }
    });
    // set componentData.tree to the edited html that has transclusions rendered
    componentData.tree = root;
    const { head: Head, header, beforeBody, pageBody: Content, afterBody, left, right, footer: Footer, } = components;
    const Header = HeaderConstructor();
    const Body = BodyConstructor();
    const LeftComponent = (_jsx("div", { class: "left sidebar", children: left.map((BodyComponent) => (_jsx(BodyComponent, { ...componentData }))) }));
    const RightComponent = (_jsx("div", { class: "right sidebar", children: right.map((BodyComponent) => (_jsx(BodyComponent, { ...componentData }))) }));
    const lang = componentData.fileData.frontmatter?.lang ?? cfg.locale?.split("-")[0] ?? "en";
    const doc = (_jsxs("html", { lang: "en-au", children: [_jsx(Head, { ...componentData }), _jsx("body", { "data-slug": slug, children: _jsxs("div", { id: "quartz-root", class: "page", children: [_jsxs(Body, { ...componentData, children: [LeftComponent, _jsxs("div", { class: "center", children: [_jsxs("div", { class: "page-header", children: [_jsx(Header, { ...componentData, children: header.map((HeaderComponent) => (_jsx(HeaderComponent, { ...componentData }))) }), _jsx("div", { class: "popover-hint", children: beforeBody.map((BodyComponent) => (_jsx(BodyComponent, { ...componentData }))) })] }), _jsx(Content, { ...componentData }), _jsx("div", { class: "page-footer", children: afterBody.map((BodyComponent) => (_jsx(BodyComponent, { ...componentData }))) })] }), RightComponent] }), _jsx(Footer, { ...componentData })] }) }), pageResources.js
                .filter((resource) => resource.loadTime === "afterDOMReady")
                .map((res) => JSResourceToScriptElement(res)), _jsx("script", { src: "https://tinylytics.app/embed/hu_4fds9-JftYEbN61AN.js?hits&kudos=\u2764\uFE0F&countries", defer: true })] }));
    return "<!DOCTYPE html>\n" + render(doc);
}
