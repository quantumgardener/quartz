import { pathToRoot } from "../util/path"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

function PageTitle({ fileData, cfg, displayClass }: QuartzComponentProps) {
  const title = cfg?.pageTitle ?? "Untitled Quartz"
  const baseDir = new URL(`https://${cfg.baseUrl ?? pathToRoot(fileData.slug!)}`)
  return (
    <h1 class={classNames(displayClass, "page-title")}>
      <a href={baseDir.href}>{title}</a>
    </h1>
  )
}

PageTitle.css = `
.page-title {
  margin: 0;
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor