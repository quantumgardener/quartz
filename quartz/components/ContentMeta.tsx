import { Date, getDate, formatDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"
import { resolveRelative, SimpleSlug } from "../util/path"

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

type LandscapeType = 'expand' | 'hobby' | 'lazy' | string;
interface LandscapeInfo {
  link: string,
  title: string
}

interface Links {
  landscape: string,
  landscapeTitle: string
  plot: string | undefined;
  plotTitle: string | undefined;
}

const landscapeInfo: { [key: LandscapeType]: LandscapeInfo } = {
  'expand': {
    link: 'expand-my-way-of-being',
    title: 'Expand my Way of Being',
  },
  'hobby': {
    link: 'hobby-together',
    title: 'Hobby Together'
  },
  'lazy': {
    link: 'productive-laziness',
    title: 'Productive Laziness'
  },
}

function landscapeHTML(links: Links) {

  const landscapeURL = `/notes/${links.landscape}`

  if (links.plot) {
    const plotURL = `/notes/${links.plot}`
    return (
      <span>
        <a class="internal tag-link" href={landscapeURL}><i style="color:#5C4033" class="nf nf-fae-mountains"></i>&nbsp; {links.landscapeTitle}</a>
        <a class="internal tag-link" href={plotURL}>&gt; {links.plotTitle}</a>
      </span>
    )
  } else {
    return (
      <span>
        <a class="internal tag-link" href={landscapeURL}><i style="color:#5C4033" class="nf nf-fae-mountains"></i>&nbsp; {links.landscapeTitle}</a>
      </span>
    )
  }
}  

function hashesToTitle( src: string ) {
  if(src === 'Second-order-learning') {
    return 'Second-order learning'
  } else {
    return src.replaceAll('-',' ')
  }
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass, allFiles }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (options.showLandscapes) {  
        const landscapeTag = fileData.frontmatter?.tags?.find(element => element.startsWith('landscape/'))
        if(landscapeTag) {
          let [tagmarker, landscape, plot] = landscapeTag.split('/')
          //const allSlugs = allFiles.map((f) => f.slug? f.slug : "")
          // if(!allSlugs.includes(plot)) {
          //   plot = null
          // }
          const links = {
            'landscape': landscapeInfo[landscape].link,
            'landscapeTitle': landscapeInfo[landscape].title,
            'plot': plot,
            'plotTitle': plot ? hashesToTitle(plot.charAt(0).toUpperCase() + plot.slice(1)) : undefined
          }

          segments.push(landscapeHTML(links))
          segments.push(<br/>)
        }
      }

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

      if (fileData.frontmatter?.page_class) {
        if (fileData.frontmatter?.page_class === "blog") {
          segments.push(<span> | <i class="nf nf-fa-link"></i> <a href="/blog">{fileData.frontmatter?.page_class}</a></span>)
        } else {
          segments.push(<span> | {fileData.frontmatter?.page_class}</span>)
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
