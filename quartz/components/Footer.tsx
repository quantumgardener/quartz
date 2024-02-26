import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <hr />
        <ul>
          {Object.entries(links).map(([text, detail]) => {
            const fontclass = detail.icon
            const iconstyle = "color: " + detail.iconcolor
            return (
            <li>
              <a href={detail.link}><i style={iconstyle} class={fontclass}></i> {text}</a>
            </li>
          )})}
          <li>|&nbsp;&nbsp;&nbsp;<a href="/privacy"><i class="fa-solid fa-lock"></i> Privacy</a></li>
          <li>|&nbsp;&nbsp;&nbsp;<a href="/notes/about"><i class="fa-solid fa-address-card"></i> About</a></li>
        </ul>
        <p>
        <i class="fa-regular fa-copyright"></i> David C. Buchan 2002&ndash;{year}. Created with <a href="https://obsidian.md">Obsidian</a> and <a href="https://quartz.jzhao.xyz/">Quartz</a>. <a rel="me" href="https://aus.social/@dcbuchan"></a>
        </p>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
