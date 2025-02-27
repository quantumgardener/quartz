import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

// from https://stackoverflow.com/posts/13897813/revisions
declare global {
    interface String {
      toTitleCase(): string;
    }
}

// from https://stackoverflow.com/posts/6475125/revisions
String.prototype.toTitleCase = function() {
  var i, j, str, lowers, uppers;
  str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless 
  // they are the first or last words in the string
  lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
  'By', 'For', 'From', 'In', 'Into', 'Is', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), 
      function(txt) {
        return txt.toLowerCase();
      });

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ['Id', 'Tv', 'Moc'];
  for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), 
      uppers[i].toUpperCase());

  return str;
}

const ArticleTitle: QuartzComponent = ({ cfg, fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  if (title) {
    //Don't convert to title case.
    //const workingTitle = title.toTitleCase()
    const workingTitle = title
    if (workingTitle.startsWith(`${i18n(cfg.locale).pages.tagContent.tag} `)) {
      return <h1 class="article-title">{workingTitle.replace(`${i18n(cfg.locale).pages.tagContent.tag} `,"")} <i class="nf nf-cod-tag"></i></h1>
    }
    if (workingTitle.startsWith(`${i18n(cfg.locale).pages.keywordContent.keyword} `)) {
      return <h1 class="article-title">{workingTitle.replace(`${i18n(cfg.locale).pages.keywordContent.keyword} `,"")} <i class="nf nf-cod-key"></i></h1>
    }
    return <h1 class={`article-title ${displayClass ?? ""}`}>{workingTitle}</h1>
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
