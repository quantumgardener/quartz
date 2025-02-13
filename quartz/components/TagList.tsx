import { pathToRoot, slugTag } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const TagList: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug!)
  const tags = Array.isArray(fileData.frontmatter?.tags) ? fileData.frontmatter.tags : [];
  const keywords = Array.isArray(fileData.frontmatter?.keywords) ? fileData.frontmatter.keywords : [];
  const combinedItems = [...tags.map(tag => ({ type: 'tag', value: tag })), ...keywords.map(keyword => ({ type: 'keyword', value: keyword }))]
  const sortedCombinedItems = combinedItems.sort((a, b) => a.value.localeCompare(b.value));
  
  if (sortedCombinedItems.length > 0) {
    return (
      <ul class={classNames(displayClass, "tags")}>
        {sortedCombinedItems.map((item) => {
          const display = `${item.value}`;
          const linkDest = item.type === 'tag' 
            ? baseDir + `/tags/${slugTag(item.value)}` 
            : baseDir + `/keywords/${slugTag(item.value)}`;
          const iconClass = item.type === 'tag' ? 'nf nf-cod-tag' : 'nf nf-cod-key';
          return (
            <li key={item.value}>
              <a href={linkDest} class="internal tag-link">
                {display} <i class={iconClass}></i>
              </a>
            </li>
          );
        })}
      </ul>
    );  
  }
}

TagList.css = `
.tags {
  list-style: none;
  /* display: flex;*/
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.section-li > .section > .tags {
  justify-content: flex-end;
}
  
.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.internal.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
  font-size: 0.8em;
}
`

export default (() => TagList) satisfies QuartzComponentConstructor
