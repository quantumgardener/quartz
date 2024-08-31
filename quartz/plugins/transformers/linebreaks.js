import remarkBreaks from "remark-breaks";
export const HardLineBreaks = () => {
    return {
        name: "HardLineBreaks",
        markdownPlugins() {
            return [remarkBreaks];
        },
    };
};
