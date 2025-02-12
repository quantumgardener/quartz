import { Date, getDate, formatDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"
import { resolveRelative, SimpleSlug } from "../util/path"
import { sort } from "d3"

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
      let segments: (string | JSX.Element)[] = []

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
          segments.push(`${formatDate(fileData.dates?.created,cfg.locale)}`)
        } else {
          segments.push(`${formatDate(fileData.dates?.modified,cfg.locale)} [original ${formatDate(fileData.dates?.created,cfg.locale)}]`)
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        if (minutes >= 1) {
          const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
            minutes: Math.ceil(minutes),
          })
          segments.push(<span> | {displayedTime}</span>)  
        }
      }

      if(fileData.frontmatter?.rating) {
        const regex = /\[\[(.*?)\|(.*?)\]\]/
        const match = fileData.frontmatter?.rating.match(regex)
        if (match) {
          const ratingSlug = match[1]
          const ratingStars = match[2]
          segments.push(<span> | <a href={`/notes/${ratingSlug}`}>{ratingStars}</a></span>)
        }        
      }

      const sortedClasses = fileData.frontmatter?.classes.sort()
      const classes: (string | JSX.Element)[] = []
      for (let i = 0; i < sortedClasses.length; i++) {
        const cls = sortedClasses[i]
        const clsText = cls.replace("-"," ")
        switch (cls) {
          case 'blog':
          case 'now':
            classes.push(<span><i class="nf nf-fa-link"></i> <a href={`/${cls}`}>{clsText}</a></span>)
            break;
          case 'ontological-distinction':
            classes.push(<span><i class="nf nf-fa-link"></i> <a href={`/notes/${cls}`}>{clsText}</a></span>)
            break;
          default:
            classes.push(<span>{clsText}</span>)
            break;
        }
        if (i < sortedClasses.length -1 ) {
          classes.push(<span>, </span>)
        }
      }
      if (classes.length > 0) {
        segments.push(<span> | </span>)
        segments = segments.concat(classes)
      }

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
