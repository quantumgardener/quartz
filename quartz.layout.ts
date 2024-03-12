import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      Mastodon: {link: "https://aus.social/@dcbuchan", icon: "fa-brands fa-mastodon", iconcolor: "rgb(140, 141, 255)"},
      "Subscribe (RSS)": {link: "https://quantumgardener.info/feed", icon: "fa-solid fa-square-rss", iconcolor: "orange"},
      Flickr: {link: "https://www.flickr.com/photos/dcbuchan/", icon: "fa-brands fa-flickr", iconcolor: "black"},
      Github: {link: "https://github.com/quantumgardener", icon: "fa-brands fa-github", iconcolor: "black"}
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      hideOnRoot: false,
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.SiteLogo(),
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  right: [
    Component.TableOfContents(),
    Component.Backlinks(),
    Component.Graph({localGraph: {
    showTags: false,
  }, globalGraph: {
    showTags: false,
  }})
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(), 
    Component.ContentMeta({
      showReadingTime: false,
      showDate: false,
      showGrowth: false,
      showLandscapes: false,
    }),
  ],
  left: [
    Component.SiteLogo(),
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  right: [
    Component.Backlinks(),
    Component.Graph({localGraph: {
    showTags: false,
  }, globalGraph: {
    showTags: false,
  }})
  ],
}
