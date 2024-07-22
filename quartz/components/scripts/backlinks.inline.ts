function toggleBacklinks(this: HTMLElement) {
  this.classList.toggle("collapsed")
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
  content.style.maxHeight = content.style.maxHeight === "0px" ? content.scrollHeight + "px" : "0px"
}

function setupBacklinks() {
  const backlinks = document.getElementById("backlinks")
  if (backlinks) {
    const collapsed = backlinks.classList.contains("collapsed")
    const content = backlinks.nextElementSibling as HTMLElement | undefined
    if (!content) return
    content.style.maxHeight = collapsed ? "0px" : content.scrollHeight + "px"
    backlinks.addEventListener("click", toggleBacklinks)
    window.addCleanup(() => backlinks.removeEventListener("click", toggleBacklinks))
  }
}

window.addEventListener("resize", setupBacklinks)
document.addEventListener("nav", () => {
  setupBacklinks()
})
