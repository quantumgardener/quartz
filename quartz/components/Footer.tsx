import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

type FooterLink = {
  link: string,
  icon: string,
}

interface Options {
  links: Record<string, FooterLink>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ cfg, allFiles, displayClass }: QuartzComponentProps) => {
    const today: Date = new Date()
    const localYear = today.toLocaleString(cfg.locale, {
      timeZone: cfg.timezone,
      year: 'numeric',
    })
    const localToday = today.toLocaleString(cfg.locale, {
      timeZone: cfg.timezone,
      dateStyle: "long",
      timeStyle: "short"
    })
    
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        
        <hr />
        <ul>
          <li><a href="/about"><i class="fa-solid fa-address-card"></i> About</a></li>
          <li><a href="/privacy"><i class="fa-solid fa-lock"></i> Privacy</a></li>
          <li>|</li>
          {Object.entries(links).map(([text, detail]) => {
            const fontclass = detail.icon
            return (
            <li>
              <a href={detail.link}><i class={fontclass}></i> {text}</a>
            </li>
          )})}
        </ul>
        <div class="site-metadata">
          <i class="fa-regular fa-copyright"></i> David C. Buchan 2002&ndash;{localYear}. Last update: {localToday}. <a href="/recent">Recently updated notes</a>.<br/>
          {allFiles.length} site pages. <a href="/colophon">Colophon</a>. 
          <a rel="me" href="https://aus.social/@dcbuchan"></a> <span class="tinylytics_hits"></span> <a href="/visits">total unique visits</a>.
        </div>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
