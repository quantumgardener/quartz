import matter from "gray-matter"
import remarkFrontmatter from "remark-frontmatter"
import { QuartzTransformerPlugin } from "../types"
import yaml from "js-yaml"
import toml from "toml"
import { slugTag } from "../../util/path"
import { QuartzPluginData } from "../vfile"
import { i18n } from "../../i18n"
import { setPositions } from "pixi.js"

export interface Options {
  delimiters: string | [string, string]
  language: "yaml" | "toml"
}

const defaultOptions: Options = {
  delimiters: "---",
  language: "yaml",
}

function coalesceAliases(data: { [key: string]: any }, aliases: string[]) {
  for (const alias of aliases) {
    if (data[alias] !== undefined && data[alias] !== null) return data[alias]
  }
}

function coerceToArray(input: string | string[]): string[] | undefined {
  if (input === undefined || input === null) return undefined

  // coerce to array
  if (!Array.isArray(input)) {
    input = input
      .toString()
      .split(",")
      .map((tag: string) => tag.trim())
  }

  // remove all non-strings
  return input
    .filter((tag: unknown) => typeof tag === "string" || typeof tag === "number")
    .map((tag: string | number) => tag.toString())
}

export const FrontMatter: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
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
                yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
                toml: (s) => toml.parse(s) as object,
              },
            })

            if (data.title != null && data.title.toString() !== "") {
              data.title = data.title.toString()
            } else {
              data.title = file.stem ?? i18n(cfg.configuration.locale).propertyDefaults.title
            }

            data.classes = []
            data.keywords = []
            const tags = coerceToArray(coalesceAliases(data, ["tags", "tag"]))
            if (tags) {           
              //
              // NOT PULLING IN ANY TAGS OTHER THAN THOSE TYPES LISTED BELOW
              //
              let uniqueTags = new Set(tags.map((tag: string) => slugTag(tag)))
    
              for (let tag of uniqueTags) {
                if (tag.startsWith("class/")) {
                  data.classes.push(tag.split("/")[1])
                  uniqueTags.delete(tag)
                }
                
                if (tag.startsWith("keyword/")) {
                  data.keywords.push(tag.split("/")[1])
                  uniqueTags.delete(tag)
                }
              }
              data.tags = Array.from(uniqueTags)
              //data.tags = []
            }

            const aliases = coerceToArray(coalesceAliases(data, ["aliases", "alias"]))
            if (aliases) data.aliases = aliases

            const cssclasses = coerceToArray(coalesceAliases(data, ["cssclasses", "cssclass"]))
            if (cssclasses) data.cssclasses = cssclasses

            const socialImage = coalesceAliases(data, ["socialImage", "image", "cover"])

            const landscapes = coerceToArray(coalesceAliases(data, ["landscapes", "landscape"]))
            if (landscapes) data.landscapes = [...new Set(landscapes.map((landscape: string) => slugTag(landscape)))]

            // fill in frontmatter
            file.data.frontmatter = data as QuartzPluginData["frontmatter"]
            
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    frontmatter: { [key: string]: unknown } & {
      title: string
    } & Partial<{
        tags: string[]
        aliases: string[]
        modified: string
        created: string
        published: string
        description: string
        publish: boolean | string
        draft: boolean | string
        lang: string
        enableToc: string
        cssclasses: string[]
        socialImage: string
        landscapes: string[]
        comments: boolean | string
        thumbnail: string
        uri: string
        classes: string[]
        keywords: string[]
        rating: string
      }>
  }
}
