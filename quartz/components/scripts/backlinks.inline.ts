const backlinksbufferPx = 150

function toggleBacklinks(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
}

function setupBacklinks() {
  const backlinks = document.getElementById("backlinks")
  if (backlinks) {
    const collapsed = backlinks.classList.contains("collapsed")
    const content = backlinks.nextElementSibling as HTMLElement | undefined
    if (!content) return
    backlinks.addEventListener("click", toggleBacklinks)
    window.addCleanup(() => backlinks.removeEventListener("click", toggleBacklinks))
  }
}

window.addEventListener("resize", setupBacklinks)
document.addEventListener("nav", () => {
  setupBacklinks()
})
