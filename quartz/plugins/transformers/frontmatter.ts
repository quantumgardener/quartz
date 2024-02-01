import matter from "gray-matter"
import remarkFrontmatter from "remark-frontmatter"
import { QuartzTransformerPlugin } from "../types"
import yaml from "js-yaml"
import toml from "toml"
import { slugTag } from "../../util/path"
import { QuartzPluginData } from "../vfile"

export interface Options {
  delims: string | string[]
  language: "yaml" | "toml"
}

const defaultOptions: Options = {
  delims: "---",
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

export const FrontMatter: QuartzTransformerPlugin<Partial<Options> | undefined> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "FrontMatter",
    markdownPlugins() {
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

            // tag is an alias for tags
            if (data.tag) {
              data.tags = data.tag.toString()
            }

            // coerce title to string
            if (data.title) {
              data.title = data.title.toString()
            } else if (data.title === null || data.title === undefined) {
              data.title = file.stem ?? "Untitled"
            }

            if (data.tags && !Array.isArray(data.tags)) {
              data.tags = data.tags
                .filter((tag: unknown) => typeof tag === "string" || typeof tag === "number")
                .map((tag: string | number) => tag.toString())
            }

            // slug them all!!
            data.tags = [...new Set(data.tags?.map((tag: string) => slugTag(tag)))] 
            
            if (data.landscapes && !Array.isArray(data.landscapes)) {
              data.landscapes = data.landscapes
                .toString()
                .split(",")
                .map((landscape: string) => landscape.trim())
            }

            // slug them all!!
            data.landscapes = [...new Set(data.landscapes?.map((landscape: string) => slugTag(landscape)))] 

            // Convert wikilink growth to plain slug value and default if missing
            data.growth = data.growth ? slugTag(data.growth) : "seedling"   

            // fill in frontmatter
            file.data.frontmatter = {
              title: file.stem ?? "Untitled",
              tags: [],
              landscapes: [],
              ...data,
            }
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
        description: string
        publish: boolean
        draft: boolean
        enableToc: string
        cssclasses: string[]
      }>
  }
}
