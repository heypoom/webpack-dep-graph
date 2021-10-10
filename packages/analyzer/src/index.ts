export { VirtualFS } from "./modules/vfs/VirtualFS"

export { Analyzer } from "./modules/analysis/Analyzer"
export { ModuleGraph } from "./modules/analysis/ModuleGraph"

export { getCircularImports } from "./modules/analysis/utils/circular"
export { createDependencyMap } from "./modules/analysis/utils/dependencyMap"

export { isAppKey } from "./modules/parsers/filterModule"
export { getProjectRoot } from "./modules/parsers/projectRoot"
export { cleanupModuleName } from "./modules/parsers/moduleParser"
export { getAbsolutePath, fileNameFromPath } from "./modules/parsers/pathParser"

export { printFileTree } from "./modules/visualizers/printFileTree"
export { createDotGraph } from "./modules/visualizers/createDotGraph"

export type {
  WebpackStat,
  WebpackModule,
  WebpackReason,
  WebpackIssuerPath,
} from "../@types/WebpackStat"

export type { Module } from "../@types/Module"
export type { AnalyzerContext, AnalyzerConfig } from "../@types/AnalyzerContext"
