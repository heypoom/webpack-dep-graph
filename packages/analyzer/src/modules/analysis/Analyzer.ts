import {
  isAppKey,
  VirtualFS,
  ModuleGraph,
  WebpackStat,
  getProjectRoot,
  AnalyzerContext,
  AnalyzerConfig,
  createDependencyMap,
} from "@analyzer"

import { extractUsages } from "./utils/extractUsages"
import { createModuleNodes } from "./utils/setupNodes"

export class Analyzer {
  stat: WebpackStat

  vfs = new VirtualFS()
  graph = new ModuleGraph()

  config: AnalyzerConfig = { projectRoot: "" }

  constructor(stat: WebpackStat) {
    this.stat = stat
  }

  analyze() {
    const projectRoot = getProjectRoot(this.stat.modules)
    if (projectRoot) this.config.projectRoot = projectRoot

    createModuleNodes(this.context)
    extractUsages(this.context)
  }

  get context(): AnalyzerContext {
    const webpackModules = this.stat.modules.filter((m) => isAppKey(m.name))

    return {
      vfs: this.vfs,
      graph: this.graph,
      webpackModules,
      projectRoot: this.config.projectRoot,
    }
  }

  get dependencies() {
    return createDependencyMap(this.graph)
  }
}
