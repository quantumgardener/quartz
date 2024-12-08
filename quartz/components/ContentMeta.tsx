import { Date, getDate, formatDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
  showDate: boolean
  showLandscapes: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: false,
  showDate: true,
  showLandscapes: true,
}

function landscapeHTML(landscape: string, title: string) {
  
  const url = `/landscapes/${landscape}`

  return (
    <span>
      <a class="internal tag-link" href={url}><i style="color:#5C4033" class="fa-solid fa-mountain-sun"></i> {title}</a>
    </span>
  )
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass, allFiles }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates && options.showDate) {
        if (fileData.dates?.created.getTime() == fileData.dates?.modified.getTime()) {
          segments.push(`${formatDate(fileData.dates?.created,cfg.locale)} | `)
        } else {
          segments.push(`${formatDate(fileData.dates?.modified,cfg.locale)} [original ${formatDate(fileData.dates?.created,cfg.locale)}] | `)
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      if (options.showLandscapes) {
        if ( fileData.frontmatter?.landscapes != null ) {
          for (const landscape of fileData.frontmatter?.landscapes) {
            const result = allFiles.find(item => item.slug === `landscapes/${landscape}`)     
            segments.push(landscapeHTML(landscape, result?.frontmatter?.title.toUpperCase() as string))
          }
        }
      }

      // End of my changes

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
