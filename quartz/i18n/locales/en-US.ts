import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "Untitled",
    description: "No description provided",
  },
  components: {
    callout: {
      note: "Note",
      abstract: "Abstract",
      info: "Info",
      todo: "Todo",
      tip: "Tip",
      success: "Success",
      question: "Question",
      warning: "Warning",
      failure: "Failure",
      danger: "Danger",
      bug: "Bug",
      example: "Example",
      quote: "Quote",
    },
    backlinks: {
      title: "Backlinks",
      noBacklinksFound: "No backlinks found",
    },
    themeToggle: {
      lightMode: "Light mode",
      darkMode: "Dark mode",
    },
    explorer: {
      title: "Explorer",
    },
    footer: {
      createdWith: "Created with",
    },
    graph: {
      title: "Graph View",
    },
    recentNotes: {
      title: "Recent Notes",
      seeRemainingMore: ({ remaining }) => `See ${remaining} more →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `Transclude of ${targetSlug}`,
      linkToOriginal: "Link to original",
    },
    search: {
      title: "Search",
      searchBarPlaceholder: "Search for something",
    },
    tableOfContents: {
      title: "Table of Contents",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `${minutes} min read`,
    },
  },
  pages: {
    rss: {
      recentNotes: "Recent notes",
      lastFewNotes: ({ count }) => `Last ${count} notes`,
    },
    error: {
      title: "Not Found",
      notFound: "Either this page is private or doesn't exist.",
    },
    folderContent: {
      folder: "Folder",
      itemsUnderFolder: ({ count }) =>
        count === 1 ? "1 item under this folder." : `${count} items under this folder.`,
    },
    tagContent: {
      tag: "",
      tagIndex: "Topic Index",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "1 conversation about this topic." : `${count} conversations about this topic.`,
      showingFirst: ({ count }) => `Showing first ${count} topics.`,
      totalTags: ({ count }) => `Found ${count} total topics.`,
    },
    landscapeContent: {
      tag: "Landscape",
      tagIndex: "Landscape Index",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "1 view in this landscape." : `${count} views in this landscape.`,
      showingFirst: ({ count }) => `Showing first ${count} views.`,
      totalTags: ({ count }) => `Found ${count} total views.`,
    },
    growthContent: {
      tag: "Growth",
      tagIndex: "Growth Index",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "1 plant growing happily." : `${count} plants growing happily.`,
      showingFirst: ({ count }) => `Showing first ${count} plants.`,
      totalTags: ({ count }) => `Found ${count} total plants.`,
    },  },
} as const satisfies Translation
