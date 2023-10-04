import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      Mastodon: "https://aus.social/@dcbuchan",
      Flickr: "https://www.flickr.com/photos/142019185@N05/",
      LinkedIn: "https://www.linkedin.com/in/buchan/",
      Github: "https://github.com/quantumgardener"
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.TableOfContents())
  ],
  right: [Component.Graph({localGraph: {
    showTags: false,
  }, globalGraph: {
    showTags: false,
  }}), 
    Component.Backlinks()
  ],
  //right: [Component.Backlinks()]
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
  ],
  right: [Component.Graph({localGraph: {
    showTags: false,
  }, globalGraph: {
    showTags: false,
  }}), 
    Component.Backlinks()
  ],
}
