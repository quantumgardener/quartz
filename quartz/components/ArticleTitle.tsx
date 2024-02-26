import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  if (title) {
    if (title.startsWith("Topic: ")) {
      return <h1 class="article-title"><i class="fa-regular fa-message"></i>&nbsp;&nbsp;{title.replace("Topic: ","")}</h1>
    } else {
      return <h1 class={`article-title ${displayClass ?? ""}`}>{title}</h1>
    }
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
