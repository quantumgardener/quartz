import { formatDate, getDate } from "./Date"
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
  showGrowth: boolean
  showLandscapes: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
  showDate: true,
  showGrowth: true,
  showLandscapes: true,
}

function growthHTML(growth: string) {

  let newgrowth = ""

  if( growth != null) {
    // We have a value in the form [[Growth]]
    newgrowth = growth.slice(2,-2).toLowerCase()
  } else {
    // Assume seedling if not specified
    newgrowth = "seedling"
  }

  let faIcon = ""

  switch(newgrowth) {
    case "seedling":
      faIcon = "seedling"
      break
    case "budding":
      faIcon = "leaf"
      break
    case "evergreen":
      faIcon = "tree"
      break
  }

  const growthClass = "fa-solid fa-" + faIcon
  const growthLink = `/maturity/${newgrowth}`

  return (
    <span>
      <a class="internal tag-link" href={growthLink}><i style="color:green" class={growthClass}></i> {newgrowth.toUpperCase()}</a>
    </span>
  )
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
        segments.push(formatDate(getDate(cfg, fileData)!, cfg.locale))
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(displayedTime)
      }

      // Start of my changes

      if (options.showGrowth) {
        segments.push(growthHTML(fileData.frontmatter?.growth))
      }

      if (options.showLandscapes) {
        if ( fileData.frontmatter?.landscapes != null ) {
          for (const landscape of fileData.frontmatter?.landscapes) {
            const result = allFiles.find(item => item.slug === `landscapes/${landscape}`)     
            segments.push(landscapeHTML(landscape, result?.frontmatter?.title.toUpperCase()))
          }
        }
      }

      // End of my changes

      const segmentsElements = segments.map((segment) => <span>{segment}</span>)

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segmentsElements}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
