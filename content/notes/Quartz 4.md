---
tags:
  - software-use
date: 2023-09-14
growth: budding
publishDate: 2023-09-27
landscapes:
  - "[[the-garden-shed]]"
description: Overview of how I use Quartz to display this digital garden. Includes a list of customisations I've made.
---
An [[Obsidian]] to website publishing system that allows me to publish directly out of my [[Digital Garden]] and so retain the benefits of a single, frictionless workflow. The GitHub source is at  https://quartz.jzhao.xyz.

[The Quantum Garden](https://quantumgardener.blog) moved to Quartz in September 2023.

## Folder Structure
```mermaid
flowchart TD
    A["/"] --> B(fa:fa-note-sticky notes)
    A --> C(fa:fa-square-rss blog)
    A --> E(fa:fa-tree maturity)
    A --> F(fa:fa-mountain-sun landscapes)
    A --> D(fa:fa-lock assets)
    A --> G(fa:fa-lock management)
```
- **[notes](/notes/index)** is the folder where most of the garden's content is kept.
- **[blog](/blog/index)** holds transitional notes, relevant only to a point in time.
- [maturity](/maturity/index) is the index of all note maturity levels.
- [landscapes](/landscapes/index) is the index of all landscapes.
- **assets** holds supporting images and attachments and is not publicly accessible.
- **[[Quartz/management/index|Management]]** holds notes I use to support the site and requires [[Obsidian]] as queries are used. It's convenient to have them all together with the other notes.

## Customisations for *The Quantum Garden*
The modifications I've made from [the original codebase](https://github.com/jackyzha0/quartz) are listed below with the file(s) where the change has been made. You're more than welcome to view them in-situ at the [site's Github repository](https://github.com/quantumgardener/qg.blog). The majority are to support [[Designing The Quantum Garden]] and others are purely informational/cosmetic.

### Remove Links to Pages That Don't Exist
I believe it's poor design to link to any pages that I can know don't exist.
- `\quartz\plugins\transformers\ofm.ts`

### Hide Tags From the Graph View
At this stage of the garden's development this hides the fact that many pages are not as inter-linked as they should be.
- `\quartz.layout.ts`

### Force All URLs and Links to Lower Case
For future proofing as mixed case URLs only cause problems when page names change.
- `\quartz\plugins\transformers\ofm.ts`
- `\quartz\util\path.ts`

There is also a custom rule applied to Cloudflare to convert all incoming URLs to lower case for any off-site references except if the file is `/static/contentIndex.json` as that breaks Search.

### Hide Folder Structure
The folder structure behind the site doesn't add as much value as good writing and linking.
- `\quartz.layout.ts`

### Automatically Show Social Icons for Social Links in Footer
Save me some work for any new social links in the footer. Solving for this change improved my [[Javascript]] knowledge.
- `\quartz\components\Footer.tsx`
- `\quartz.layout.ts`

### Format Dates to my Liking
Some small configuration options. Note that dates are no longer being shown as part of [[Designing The Quantum Garden]].
- `\quartz\components\Date.tsx`

### Display a Note's Growth Status
Display [[Seedling]], [[Budding]] or [[Evergreen]] status -- Automated from a `growth` property on each page in preference to using tags because the purpose of the information is different.
- `\quartz\components\ContentMeta.tsx`

### Display .webp images
Include images for the new compressed web image format.
- `\quartz\plugins\transformers\ofm.ts`

### Display Tag Icon as Part of Tag Link
Display tags with a icon rather than a `#`
- `\quartz\components\PageLiist.tsx`
- `\quartz\components\TagList.tsx`

### Tag Pages List Their Tags
Tag pages can themselves be tagged and show the list of their tags.
- `\quartz\components\pages\TagContent.tsx`

### Tag Pages Hide Their Tag Name from Linked Items
If you are on a tag page, the list of notes with that tag no longer display the name of the page itself. It's completely redundant information.
- `\quartz\components\PageLiist.tsx`

### Landscape Index pages
Add pages to index all notes within one or more [[Landscapes]].
- `\quartz\quartz.config.ts`
- `\quartz\components\index.ts`
- `\quartz\components\ContentMeta.tsx`
- `\quartz\components\pages\LandscapeContent.tsx`
- `\quartz\plugins\emitters\index.ts`
- `\quartz\plugins\emmiters\landscapePage.tsx`
- `\quartz\plugins\transformers\frontmatter.ts`

### Change tags folder to topics folder
I prefer topics over tags. Possibly could have done this with a site redirect, but I like this way better. Fixes it at the root.
- `\quartz\components\Explorer.tsx`
- `\quartz\components\PageList.tsx`
- `\quartz\components\RecentNotes.tsx`
- `\quartz\components\TagList.tsx`
- `\quartz\components\pages\LandscapeContent.tsx`
- `\quartz\components\pages\TagContent.tsx`
- `\quartz\components\scripts\graph.inline.ts`
- `\quartz\plugins\emitters\folderPage.tsx`
- `\quartz\plugins\emitters\tagPage.tsx`
- `\quartz\plugins\transformers\ofm.ts`
- `\quartz\util\path.test.ts`

### Replace topic indicator for topics that don't have a dedicated note
The default is to say "Topic: abcd". Now the [FontAwesome Message icon](https://fontawesome.com/icons/message?f=classic&s=regular) is displayed instead, and throughout the site for all topic labels.
- `\quartz\components\Articles.tsx`
- `\quartz\components\PageList.tsx`
- `\quartz\components\TagList.tsx`
- `\quartz\components\pages\LandscapeContent.tsx`
- `\quartz\components\pages\TagContent.tsx`

### Growth Maturity Index pages
Add pages to index all notes with their maturity level of [[Seedling]], [[Budding]], or [[Evergreen]].
- `\quartz\quartz.config.ts`
- `\quartz\components\index.ts`
- `\quartz\components\ContentMeta.tsx`
- `\quartz\components\pages\GrowthContent.tsx`
- `\quartz\plugins\emitters\index.ts`
- `\quartz\plugins\emmiters\GrowthPage.tsx`