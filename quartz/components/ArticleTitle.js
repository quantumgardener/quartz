import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
// from https://stackoverflow.com/posts/6475125/revisions
String.prototype.toTitleCase = function () {
    var i, j, str, lowers, uppers;
    str = this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    // Certain minor words should be left lowercase unless 
    // they are the first or last words in the string
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
        'By', 'For', 'From', 'In', 'Into', 'Is', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
    for (i = 0, j = lowers.length; i < j; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), function (txt) {
            return txt.toLowerCase();
        });
    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv', 'Moc'];
    for (i = 0, j = uppers.length; i < j; i++)
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase());
    return str;
};
const ArticleTitle = ({ fileData, displayClass }) => {
    const title = fileData.frontmatter?.title;
    if (title) {
        //Don't convert to title case.
        //const workingTitle = title.toTitleCase()
        const workingTitle = title;
        if (workingTitle.startsWith("Topic: ")) {
            return _jsxs("h1", { class: "article-title", children: [_jsx("i", { class: "fa-regular fa-message" }), "\u00A0\u00A0", workingTitle.replace("Topic: ", "")] });
        }
        else {
            return _jsx("h1", { class: `article-title ${displayClass ?? ""}`, children: workingTitle });
        }
    }
    else {
        return null;
    }
};
ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`;
export default (() => ArticleTitle);
