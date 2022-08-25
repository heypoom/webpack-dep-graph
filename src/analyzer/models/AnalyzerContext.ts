import { ModuleGraph } from "../ModuleGraph"
import { VirtualFS } from "../vfs/VirtualFS"
import { IWebpackStatsV5Module } from "./webpack5.model"

export interface AnalyzerContext extends AnalyzerConfig {
	vfs: VirtualFS
	graph: ModuleGraph
	webpackModules: IWebpackStatsV5Module[]
	dependencyMap: Record<string, string[]>
	circularImports: string[][]
}

export interface AnalyzerConfig {
	projectRoot: string
	printImportAnalysis?: boolean
}
