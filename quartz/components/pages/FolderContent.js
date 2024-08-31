import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import path from "path";
import style from "../styles/listPage.scss";
import { PageList } from "../PageList";
import { stripSlashes, simplifySlug } from "../../util/path";
import { htmlToJsx } from "../../util/jsx";
import { i18n } from "../../i18n";
const defaultOptions = {
    showFolderCount: true,
};
export default ((opts) => {
    const options = { ...defaultOptions, ...opts };
    const FolderContent = (props) => {
        const { tree, fileData, allFiles, cfg } = props;
        const folderSlug = stripSlashes(simplifySlug(fileData.slug));
        const allPagesInFolder = allFiles.filter((file) => {
            const fileSlug = stripSlashes(simplifySlug(file.slug));
            const prefixed = fileSlug.startsWith(folderSlug) && fileSlug !== folderSlug;
            const folderParts = folderSlug.split(path.posix.sep);
            const fileParts = fileSlug.split(path.posix.sep);
            const isDirectChild = fileParts.length === folderParts.length + 1;
            return prefixed && isDirectChild;
        });
        const cssClasses = fileData.frontmatter?.cssclasses ?? [];
        const classes = ["popover-hint", ...cssClasses].join(" ");
        const listProps = {
            ...props,
            sort: options.sort,
            allFiles: allPagesInFolder,
        };
        const content = tree.children.length === 0
            ? fileData.description
            : htmlToJsx(fileData.filePath, tree);
        return (_jsxs("div", { class: classes, children: [_jsx("article", { children: content }), _jsxs("div", { class: "page-listing", children: [options.showFolderCount && (_jsx("p", { children: i18n(cfg.locale).pages.folderContent.itemsUnderFolder({
                                count: allPagesInFolder.length,
                            }) })), _jsx("div", { children: _jsx(PageList, { ...listProps }) })] })] }));
    };
    FolderContent.css = style + PageList.css;
    return FolderContent;
});
