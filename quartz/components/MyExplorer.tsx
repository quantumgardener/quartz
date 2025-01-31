import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import explorerStyle from "./styles/explorer.scss"

// @ts-ignore
import script from "./scripts/explorer.inline"
import { ExplorerNode, FileNode, Options } from "./MyExplorerNode"
import { QuartzPluginData } from "../plugins/vfile"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

// Options interface defined in `ExplorerNode` to avoid circular dependency
const defaultOptions = {
  folderClickBehavior: "collapse",
  folderDefaultState: "collapsed",
  useSavedState: true,
  mapFn: (node) => {
    return node
  },
  sortFn: (a, b) => {
    // Sort order: folders first, then files. Sort folders and files alphabetically
    if ((!a.file && !b.file) || (a.file && b.file)) {
      // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
      // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
      return a.displayName.localeCompare(b.displayName, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    }

    if (a.file && !b.file) {
      return 1
    } else {
      return -1
    }
  },
  filterFn: (node) => node.name !== "topics",
  order: ["filter", "map", "sort"],
} satisfies Options

export default ((userOpts?: Partial<Options>) => {
  // Parse config
  const opts: Options = { ...defaultOptions, ...userOpts }

  // memoized
  let fileTree: FileNode
  let jsonTree: string
  let lastBuildId: string = ""

  function constructFileTree(allFiles: QuartzPluginData[]) {
    // Construct tree from allFiles
    fileTree = new FileNode("")
    // allFiles.forEach((file) => fileTree.add(file)})

    interface MenuItem {
      slug: string;
      children?: MenuItem[];
      name?: string,
      parent?: FileNode;
      depth?: number;
    }

    const menu: MenuItem[] = [
      { slug: 'notes/humanity-in-the-workplace' },
      { 
        slug: 'notes/expand-my-way-of-being', 
        children: [
          { slug: 'notes/way-of-being'},
          { slug: 'notes/basic-moods-of-life'}
        ]
      },
      { 
        slug: 'notes/productive-laziness',
        children: [
          { slug: 'notes/personal-knowledge-management'}
        ]
      },
      { 
        slug: 'notes/hobby-together',
        children: [
          { slug: 'notes/photography'},
          { slug: 'notes/video-gaming'},
          { slug: 'notes/imatch-to-socials' }
        ]
      },
      { slug: 'photos/index'},
      { slug: 'projects',
        children: [
          { slug: 'notes/100-hours-learning-affinity-photo'}
        ]
      },
      { slug: 'subscribe'}
    ]

    const parseMenu = (items: MenuItem[], parent: FileNode | undefined = undefined, depth = 0) => {
      items.forEach(item => {
        item.parent = parent
        item.depth = depth
        
        let node: FileNode

        const matchedFile: QuartzPluginData = allFiles.filter((file) => file.slug === item.slug)[0]
        if (matchedFile) {
          node = new FileNode(item.slug, undefined, matchedFile, item.depth)
          if (parent) {
            parent.children.push(node)
          } else {
            fileTree.children.push(node)
          }
          if (item.children) {
            parseMenu(item.children, node, item.depth + 1)
          }
        } else {
          console.error(`Missing menu item '${item.slug}`)
        }
      })
    }

    parseMenu(menu)
  
    // Execute all functions (sort, filter, map) that were provided (if none were provided, only default "sort" is applied)
    if (opts.order) {
      // Order is important, use loop with index instead of order.map()
      for (let i = 0; i < opts.order.length; i++) {
        const functionName = opts.order[i]
        if (functionName === "map") {
          fileTree.map(opts.mapFn)
        } else if (functionName === "sort") {
          fileTree.sort(opts.sortFn)
        } else if (functionName === "filter") {
          fileTree.filter(opts.filterFn)
        }
      }
    }

    // Get all folders of tree. Initialize with collapsed state
    // Stringify to pass json tree as data attribute ([data-tree])
    const folders = fileTree.getFolderPaths(opts.folderDefaultState === "collapsed")
    jsonTree = JSON.stringify(folders)
  }

  const Explorer: QuartzComponent = ({
    ctx,
    cfg,
    allFiles,
    displayClass,
    fileData,
  }: QuartzComponentProps) => {
    if (ctx.buildId !== lastBuildId) {
      lastBuildId = ctx.buildId
      constructFileTree(allFiles)
    }

    return (
      <div class={classNames(displayClass, "explorer")}>
        <button
          type="button"
          id="explorer"
          data-behavior={opts.folderClickBehavior}
          data-collapsed={opts.folderDefaultState}
          data-savestate={opts.useSavedState}
          data-tree={jsonTree}
          aria-controls="explorer-content"
          aria-expanded={opts.folderDefaultState === "open"}
        >
          <h2>{opts.title ?? i18n(cfg.locale).components.explorer.title} <a href="/notes/landscapes" style="color:var(--secondary)"><i class="nf nf-fa-question_circle"></i></a></h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="fold"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div id="explorer-content">
          <ul class="overflow" id="explorer-ul">
            <ExplorerNode node={fileTree} opts={opts} fileData={fileData} />
            <li id="explorer-end" />
          </ul>
        </div>
      </div>
    )
  }

  Explorer.css = explorerStyle
  Explorer.afterDOMLoaded = script
  return Explorer
}) satisfies QuartzComponentConstructor
