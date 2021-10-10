export { VirtualFS } from "./modules/vfs/VirtualFS"

export { Analyzer } from "./modules/analysis/Analyzer"
export { ModuleGraph } from "./modules/analysis/ModuleGraph"
export { getCircularImports } from "./modules/analysis/utils/circular"

export { isAppKey } from "./modules/parsers/filterModule"
export { getProjectRoot } from "./modules/parsers/projectRoot"
export { cleanupModuleName } from "./modules/parsers/moduleParser"
export { getAbsolutePath, fileNameFromPath } from "./modules/parsers/pathParser"

export { printFileTree } from "./modules/producers/printFileTree"
export { createDotGraph } from "./modules/producers/createDotGraph"
export { createDependencyMap } from "./modules/producers/createDependencyMap"

export type {
  WebpackStat,
  WebpackModule,
  WebpackReason,
  WebpackIssuerPath,
} from "../@types/WebpackStat"

export type { Module } from "../@types/Module"
export type { AnalyzerContext, AnalyzerConfig } from "../@types/AnalyzerContext"
