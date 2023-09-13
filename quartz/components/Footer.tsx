import { QuartzComponentConstructor } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  function Footer() {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer>
        <hr />
        <p>
          © David C. Buchan 2002&ndash;{year}. Created with <a href="https://quartz.jzhao.xyz/">Quartz</a>.
        </p>
        <ul>
          {/* {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))} */}
          <li><a href="https://aus.social/@dcbuchan"><i class="fa-brands fa-mastodon"></i> Mastodon</a></li>
          <li><a href="https://www.flickr.com/photos/dcbuchan/"><i class="fa-brands fa-flickr"></i> Flickr</a></li>
          <li><a href="https://www.linkedin.com/in/buchan/"><i class="fa-brands fa-linkedin"></i> LinkedIn</a></li>
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
