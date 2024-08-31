import matter from "gray-matter";
import remarkFrontmatter from "remark-frontmatter";
import yaml from "js-yaml";
import toml from "toml";
import { slugTag } from "../../util/path";
import { i18n } from "../../i18n";
const defaultOptions = {
    delimiters: "---",
    language: "yaml",
};
function coalesceAliases(data, aliases) {
    for (const alias of aliases) {
        if (data[alias] !== undefined && data[alias] !== null)
            return data[alias];
    }
}
function coerceToArray(input) {
    if (input === undefined || input === null)
        return undefined;
    // coerce to array
    if (!Array.isArray(input)) {
        input = input
            .toString()
            .split(",")
            .map((tag) => tag.trim());
    }
    // remove all non-strings
    return input
        .filter((tag) => typeof tag === "string" || typeof tag === "number")
        .map((tag) => tag.toString());
}
export const FrontMatter = (userOpts) => {
    const opts = { ...defaultOptions, ...userOpts };
    return {
        name: "FrontMatter",
        markdownPlugins({ cfg }) {
            return [
                [remarkFrontmatter, ["yaml", "toml"]],
                () => {
                    return (_, file) => {
                        const { data } = matter(Buffer.from(file.value), {
                            ...opts,
                            engines: {
                                yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
                                toml: (s) => toml.parse(s),
                            },
                        });
                        if (data.title != null && data.title.toString() !== "") {
                            data.title = data.title.toString();
                        }
                        else {
                            data.title = file.stem ?? i18n(cfg.configuration.locale).propertyDefaults.title;
                        }
                        const tags = coerceToArray(coalesceAliases(data, ["tags", "tag"]));
                        if (tags)
                            data.tags = [...new Set(tags.map((tag) => slugTag(tag)).sort())];
                        const aliases = coerceToArray(coalesceAliases(data, ["aliases", "alias"]));
                        if (aliases)
                            data.aliases = aliases;
                        const cssclasses = coerceToArray(coalesceAliases(data, ["cssclasses", "cssclass"]));
                        if (cssclasses)
                            data.cssclasses = cssclasses;
                        const landscapes = coerceToArray(coalesceAliases(data, ["landscapes", "landscape"]));
                        if (landscapes)
                            data.landscapes = [...new Set(landscapes.map((landscape) => slugTag(landscape)))];
                        // fill in frontmatter
                        file.data.frontmatter = data;
                    };
                },
            ];
        },
    };
};
