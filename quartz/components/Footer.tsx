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
          <li><a href="/about"><i class="nf nf-fa-address_card"></i> About</a></li>
          <li><a href="/privacy"><i class="nf nf-fa-lock"></i> Privacy</a></li>
          <li>|</li>
          <li><a href="https://aus.social/@dcbuchan"><i class="nf nf-fa-mastodon"></i> Mastodon</a></li>
          <li><a href="/subscribe"><i class="nf nf-fa-square_rss"></i> Subscribe</a></li>
          <li><a href="https://www.flickr.com/photos/dcbuchan/"><i class="nf nf-fa-flickr"></i> flickr</a></li>
          <li><a href="https://pixelfed.au/dcbuchan"><i class="nf nf-fa-photo_film"></i> Pixelfed</a></li>
          <li><a href="https://github.com/quantumgardener"><i class="nf nf-fa-github"></i> Github</a></li>
        </ul>
        <div class="site-metadata">
          &copy; David C. Buchan 2002&ndash;{localYear}. Last update: {localToday}. <a href="/recent">Recently updated notes</a>.<br/>
          {allFiles.length} site pages. <a href="/colophon">Colophon</a>. 
          <a rel="me" href="https://aus.social/@dcbuchan"></a> <span class="tinylytics_hits"></span> <a href="/visits">total unique visits</a>.
        </div>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
