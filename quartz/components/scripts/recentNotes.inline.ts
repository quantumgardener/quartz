const notesbufferPx = 150

function toggleRecentNotes(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
}

function setupRecentNotes() {
  const recent = document.getElementById("recent-notes")
  if (recent) {
    const collapsed = recent.classList.contains("collapsed")
    const content = recent.nextElementSibling as HTMLElement | undefined
    if (!content) return
    recent.addEventListener("click", toggleRecentNotes)
    window.addCleanup(() => recent.removeEventListener("click", toggleRecentNotes))
  }
}

window.addEventListener("resize", setupRecentNotes)
document.addEventListener("nav", () => {
  setupRecentNotes()
})
