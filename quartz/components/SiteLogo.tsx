import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function SiteLogo({ cfg, fileData }: QuartzComponentProps) {
  const ogImagePath = `/static/qg-image.png`
  return <div><a href="/"><img class="site-logo" src={ogImagePath} alt="Return to Home Page"></img></a></div>
}
SiteLogo.css = `
.site-logo {
  margin: 1rem 1rem 0 0;
  text-align: centre;
}
`

export default (() => SiteLogo) satisfies QuartzComponentConstructor
