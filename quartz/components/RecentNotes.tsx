import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, joinSegments, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/recentNotes.scss"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

// @ts-ignore
import script from "./scripts/recentNotes.inline"

interface Options {
  title?: string
  limit: number
  linkToMore: SimpleSlug | false
  showTags: boolean
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 3,
  linkToMore: false,
  showTags: true,
  filter: () => true,
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  const RecentNotes: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const pages = allFiles.filter(opts.filter).sort(opts.sort)
    const remaining = Math.max(0, pages.length - opts.limit)
    return (
      <div class={classNames(displayClass, "recent-notes")}>
        <button 
          type="button" 
          id="recent-notes" 
          class={fileData.collapseToc ? "collapsed" : ""}
          aria-controls="recent-notes-content"
          aria-expanded={!fileData.collapseBacklinks}
        >
        <h3>{opts.title ?? i18n(cfg.locale).components.recentNotes.title} <a href="https://quantumgardener.info/feed" style="color:var(--secondary)"><i class="nf nf-fa-square_rss"></i></a></h3>
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
        <div id="recent-notes-content" class={fileData.collapseRecentNotes ? "collapsed" : ""}>
          <ul class="overflow" id="recent-notes-ul">
            {pages.slice(0, opts.limit).map((page) => {
              const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title

              return (
                <li>
                      <a href={joinSegments("/", page.slug!)} class="internal">
                        {title}</a><br/>
                        {page.dates && (
                      <span class="meta">
                        <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                      </span>
                    )}
                </li>
              )
            })}
            <li style="padding-top:1rem; font-style:italic">
            <a href="/blog">Archive&hellip;</a>
          {opts.linkToMore && remaining > 0 && (
            <p>
              <a href={resolveRelative(fileData.slug!, opts.linkToMore)}>
                {i18n(cfg.locale).components.recentNotes.seeRemainingMore({ remaining })}
              </a>
            </p>
          )}
            </li>
          </ul>
          
        </div>
      </div>
    )
  }

  RecentNotes.css = style
  RecentNotes.afterDOMLoaded = script
  return RecentNotes
}) satisfies QuartzComponentConstructor
