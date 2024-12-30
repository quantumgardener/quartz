function toggleRecentNotes(this: HTMLElement) {
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

function setupRecentNotes() {
  const recentnotes = document.getElementById("recent-notes")
  if (recentnotes) {
    const collapsed = recentnotes.classList.contains("collapsed")
    const content = recentnotes.nextElementSibling as HTMLElement | undefined
    if (!content) return
    content.style.maxHeight = collapsed ? "0px" : content.scrollHeight + "px"
    recentnotes.addEventListener("click", toggleRecentNotes)
    window.addCleanup(() => recentnotes.removeEventListener("click", toggleRecentNotes))
  }
}

window.addEventListener("resize", setupRecentNotes)
document.addEventListener("nav", () => {
  setupRecentNotes()
})
