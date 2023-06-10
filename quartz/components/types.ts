import { ComponentType, JSX } from "preact"
import { StaticResources } from "../resources"
import { QuartzPluginData } from "../plugins/vfile"
import { GlobalConfiguration } from "../cfg"
import { Node } from "hast"

export type QuartzComponentProps = {
  externalResources: StaticResources
  fileData: QuartzPluginData
  cfg: GlobalConfiguration
  children: QuartzComponent[] | JSX.Element[]
  tree: Node<QuartzPluginData>
  position?: 'sidebar' | 'header' | 'body'
}

export type QuartzComponent = ComponentType<QuartzComponentProps> & {
  css?: string,
  beforeDOMLoaded?: string,
  afterDOMLoaded?: string,
}
