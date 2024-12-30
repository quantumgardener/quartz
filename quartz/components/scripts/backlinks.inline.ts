function toggleBacklinks(this: HTMLElement) {
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
  if (content.classList.contains("collapsed")) { 
    content.style.maxHeight = "0px"; 
    content.style.overflow = "hidden"; 
  } else { 
    content.style.maxHeight = content.scrollHeight + "px"; 
    content.style.overflow = "visible"; }
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
