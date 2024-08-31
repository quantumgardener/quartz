import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { pathToRoot, slugTag } from "../util/path";
import { classNames } from "../util/lang";
const TagList = ({ fileData, displayClass }) => {
    const tags = fileData.frontmatter?.tags;
    const baseDir = pathToRoot(fileData.slug);
    return null;
    if (tags && tags.length > 0) {
        return (_jsx("ul", { class: classNames(displayClass, "tags"), children: tags.map((tag) => {
                const display = `${tag}`;
                const linkDest = baseDir + `/topics/${slugTag(tag)}`;
                return (_jsx("li", { children: _jsxs("a", { href: linkDest, class: "internal tag-link", children: [_jsx("i", { class: "fa-regular fa-message" }), "\u00A0\u00A0", display] }) }));
            }) }));
    }
    else {
        return null;
    }
};
TagList.css = `
.tags {
  list-style: none;
  /* display: flex;*/
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
  flex-wrap: wrap;
  justify-self: end;
}

.section-li > .section > .tags {
  justify-content: flex-end;
}
  
.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.internal.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
  font-size: 0.8em;
}
`;
export default (() => TagList);
