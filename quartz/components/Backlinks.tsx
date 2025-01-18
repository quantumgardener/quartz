import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/backlinks.scss"
import { resolveRelative, simplifySlug } from "../util/path"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

// @ts-ignore
import script from "./scripts/backlinks.inline"

interface BacklinksOptions {
  hideWhenEmpty: boolean
}

const defaultOptions: BacklinksOptions = {
  hideWhenEmpty: true,
}

// List of slugs we don't want to appear in backlinks
const excludedSlugs = [
  'blog',
  'dropped',
  'ideas',
  'maps',
  'now',
  'recent',
  'sitemap',
  'slashes',
]

export default ((opts?: Partial<BacklinksOptions>) => {
  const options: BacklinksOptions = { ...defaultOptions, ...opts }

  const Backlinks: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const slug = simplifySlug(fileData.slug!)
    const backlinkFiles = allFiles.filter((file) => file.links?.includes(slug) && !excludedSlugs.includes(file.slug as string) && file.slug as string != slug as string)
    if (options.hideWhenEmpty && backlinkFiles.length == 0) {
      return null
    }
    return (
      <div class={classNames(displayClass, "backlinks")}>
        <button
        type="button"
        id="backlinks"
        class={fileData.collapseBacklinks ? "collapsed" : ""}
        aria-controls="backlinks-content"
        aria-expanded={!fileData.collapseBacklinks}
        >
          <h3>{i18n(cfg.locale).components.backlinks.title} <a href="/notes/backlinks" style="color:var(--secondary)"><i class="fa-solid fa-circle-question"></i></a></h3>
          <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="fold"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        </button>
        <div id="backlinks-content" class={fileData.collapseBacklinks ? "collapsed" : ""}>
          <ul class="overflow">
            {backlinkFiles.length > 0 ? (
              backlinkFiles.map((f) => (
                <li>
                  <a href={resolveRelative(fileData.slug!, f.slug!)}>
                    {f.frontmatter?.title}
                  </a>
                </li>
              ))
            ) : (
              <li>{i18n(cfg.locale).components.backlinks.noBacklinksFound}</li>
            )}
          </ul>
        </div>
      </div>
    )
  }

  Backlinks.css = style
  Backlinks.afterDOMLoaded = script

  return Backlinks
}) satisfies QuartzComponentConstructor