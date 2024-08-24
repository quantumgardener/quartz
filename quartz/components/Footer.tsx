import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { formatDate } from "./Date"

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
        <button class="tinylytics_kudos"></button>
        <hr />
        <ul>
          <li><a href="/notes/about"><i class="fa-solid fa-address-card"></i> About</a></li>
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
          <i class="fa-regular fa-copyright"></i> David C. Buchan 2002&ndash;{localYear}. Created with <a href="https://obsidian.md">Obsidian</a> and <a href="https://quartz.jzhao.xyz/">Quartz</a>. <a rel="me" href="https://aus.social/@dcbuchan"></a><br />
          Site pages: {allFiles.length}. Last update: {localToday}. <a href="/recent">Recently updated notes</a>.<br/>
          <a href="/total-unique-visitors">Total unique visitors</a>: <span class="tinylytics_hits"></span> from <span class="tinylytics_countries flags"></span>
        </div>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
