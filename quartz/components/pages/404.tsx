import { QuartzComponentConstructor } from "../types"

function NotFound() {
  return (
    <article class="popover-hint">
      <h1>Page Not Found</h1>
      <p>Sadly, the page you are looking for can't be found. There can be several reasons for this.</p>
      <ul>
        <li>The page doesn't exist and never has.</li>
        <li>Content has not yet migrated across from an earlier version of the website.</li>
        <li>Something was typed incorrectly.</li>
      </ul>
      <p>Please return to the <a href="/">Home page</a> where you can use Search to find what you are seeking.</p>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
