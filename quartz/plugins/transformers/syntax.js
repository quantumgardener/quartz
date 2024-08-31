import rehypePrettyCode from "rehype-pretty-code";
const defaultOptions = {
    theme: {
        light: "github-light",
        dark: "github-dark",
    },
    keepBackground: false,
};
export const SyntaxHighlighting = (userOpts) => {
    const opts = { ...defaultOptions, ...userOpts };
    return {
        name: "SyntaxHighlighting",
        htmlPlugins() {
            return [[rehypePrettyCode, opts]];
        },
    };
};
