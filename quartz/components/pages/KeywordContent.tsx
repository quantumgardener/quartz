import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { ImageGallery, SortFn } from "../ImageGallery"
import { FullSlug, getAllSegmentPrefixes, simplifySlug } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"

interface KeywordContentOptions {
  sort?: SortFn
  numPages: number
}

const defaultOptions: KeywordContentOptions = {
  numPages: 10,
}

export default ((opts?: Partial<KeywordContentOptions>) => {
  const options: KeywordContentOptions = { ...defaultOptions, ...opts }

  const KeywordContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props
    const slug = fileData.slug

    if (!(slug?.startsWith("keywords/") || slug === "keywords")) {
      throw new Error(`Component "KeywordContent" tried to render a non-keyword page: ${slug}`)
    }

    const keyword = simplifySlug(slug.slice("keywords/".length) as FullSlug)
    const allPagesWithTag = (keyword: string) =>
      allFiles.filter((file) =>
        (file.frontmatter?.keywords ?? []).flatMap(getAllSegmentPrefixes).includes(keyword),
      )

    const content =
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")
    if (keyword === "/") {
      const keywords = [
        ...new Set(
          allFiles.flatMap((data) => data.frontmatter?.keywords ?? []).flatMap(getAllSegmentPrefixes),
        ),
      ].sort((a, b) => a.localeCompare(b))
      const keywordItemMap: Map<string, QuartzPluginData[]> = new Map()
      for (const keyword of keywords) {
        keywordItemMap.set(keyword, allPagesWithTag(keyword))
      }
      // Group keywords
      let groupedKeywords = keywords.reduce((acc, keyword) => {
        let firstLetter = keyword[0].toLowerCase(); // Get the first letter
        if (!acc[firstLetter]) {
          acc[firstLetter] = []; // Initialize the array if it doesn't exist
        }
        acc[firstLetter].push(keyword);
        return acc;
      }, {});
      return (
        <div class="popover-hint">
          <article class={classes}>
            <p>{content}</p>
          </article>
          <p>{i18n(cfg.locale).pages.keywordContent.totalKeywords({ count: keywords.length })}</p>
          <hr />
          <ul class="tags">
            {Object.keys(groupedKeywords).sort().map(letter => (
              <div key={letter}>
                <h2>{letter.toUpperCase()}</h2>
                <ul>
                  {groupedKeywords[letter].map((keyword, index) => {
                    const pages = keywordItemMap.get(keyword)!;
                    const listProps = {
                      ...props,
                      allFiles: pages,
                    };

                    const contentPage = allFiles.filter(file => file.slug === `keywords/${keyword}`).at(0);

                    const root = contentPage?.htmlAst;
                    const content = !root || root?.children.length === 0
                      ? contentPage?.description
                      : htmlToJsx(contentPage.filePath!, root);

                    return (
                      <li key={index}>
                        <a class="internal tag-link" href={`../keywords/${keyword}`}>
                          {keyword} <i class="nf nf-cod-key"></i> ({allPagesWithTag(keyword).length})
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </ul>;
        </div>
      )
    } else {
      const pages = allPagesWithTag(keyword)
      const listProps = {
        ...props,
        allFiles: pages,
      }

      return (
        <div class={classes}>
          <article class="popover-hint">{content}</article>
          <div class="page-listing">
            <p>{i18n(cfg.locale).pages.keywordContent.itemsUnderKeyword({ count: pages.length })}</p>
            <div>
              <ImageGallery {...listProps} sort={options?.sort} />
            </div>
          </div>
        </div>
      )
    }
  }

  KeywordContent.css = style + ImageGallery.css
  return KeywordContent
}) satisfies QuartzComponentConstructor