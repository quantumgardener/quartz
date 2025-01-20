import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  // If baseUrl contains a pathname after the domain, use this as the home link
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <p>Sadly, the page you are looking for can't be found. There can be several reasons for this.</p>
      <ul>
        <li>The page doesn't exist and never has.</li>
        <li>Something was typed incorrectly.</li>
        <li>Content has been moved and not relinked.</li>
      </ul>
      <p>Please return to the <a href="/">Home page</a> or use the <strong>Search box</strong> to find what you are seeking.</p>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
