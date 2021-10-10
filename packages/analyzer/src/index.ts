export { VirtualFS } from "./modules/vfs/FileSystem"

export { Analyzer } from "./modules/analysis/Analyzer"
export { ModuleGraph } from "./modules/analysis/ModuleGraph"

export { isAppKey } from "./utils/filterModule"
export { getCircularImports } from "./utils/circular"

export { cleanupModuleName } from "./utils/moduleParser"
export { getAbsolutePath, fileNameFromPath } from "./utils/pathParser"
export { getProjectRoot } from "./utils/projectRoot"

export { printFileTree } from "./utils/printFileTree"
export { createDotGraph } from "./utils/createDotGraph"
export { createDependencyMap } from "./utils/createDependencyMap"

export type {
  WebpackStat,
  WebpackModule,
  WebpackReason,
  WebpackIssuerPath,
} from "../@types/WebpackStat"

export type { Module } from "../@types/Module"
export type { AnalyzerContext, AnalyzerConfig } from "../@types/AnalyzerContext"
