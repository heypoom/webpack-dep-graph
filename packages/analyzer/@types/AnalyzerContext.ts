import { ModuleGraph, VirtualFS, WebpackModule } from "@analyzer"

export interface AnalyzerContext extends AnalyzerConfig {
  vfs: VirtualFS
  graph: ModuleGraph

  webpackModules: WebpackModule[]
}

export interface AnalyzerConfig {
  projectRoot: string
}
