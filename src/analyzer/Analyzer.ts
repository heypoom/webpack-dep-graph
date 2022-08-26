import { AnalyzerConfig, AnalyzerContext } from "./models/AnalyzerContext"
import { ModuleGraph } from "./ModuleGraph"
import { isAppSourcesPath } from "./parsers/filterModule"
import { getAppRootPath } from "./parsers/projectRoot"
import { VirtualFS } from "./vfs/VirtualFS"
import { IWebpackStatsV5, IWebpackStatsV5Module } from "./models/webpack5.model"
import {
	getDependencyMap,
	createModuleNodes,
	extractUsages,
	getCircularImports,
} from "./analyzerUtils/index"

export class Analyzer {
	stat: IWebpackStatsV5
	config: AnalyzerConfig = { projectRoot: "" }
	analyzerContext: AnalyzerContext

	constructor(stat: IWebpackStatsV5) {
		this.stat = stat
		this.analyzerContext = {
			...this.config,
			vfs: new VirtualFS(),
			graph: new ModuleGraph(),
			webpackModules: this.stat.modules.filter((m) =>
				isAppSourcesPath(m.name)
			),
            dependencyMap: {},
            circularImports: [],
		}
	}

	getStatCount() {
		return {
			dependenciesById: this.analyzerContext.graph.dependenciesById.size,
			issuedBy: this.analyzerContext.graph.issuedBy.size,
			exportedBy: this.analyzerContext.graph.exportedBy.size,
			nodeIdByRelativePath: this.analyzerContext.graph.nodeIdByRelativePath.size,
			nodesById: this.analyzerContext.graph.nodesById.size,
		}
	}

	analyze(): AnalyzerContext {
		console.log("src/analyzer/Analyzer.ts:23", this.stat.modules.length)

		const projectRoot = getAppRootPath(this.stat.modules)
		if (projectRoot) this.config.projectRoot = projectRoot

		console.log("src/analyzer/Analyzer.ts:27", this.getStatCount())

		this.analyzerContext.graph = createModuleNodes(this.analyzerContext)
		console.log("src/analyzer/Analyzer.ts:28", this.getStatCount())

		this.analyzerContext.graph = extractUsages(this.analyzerContext)
		console.log("src/analyzer/Analyzer.ts:30", this.getStatCount())

        this.analyzerContext.dependencyMap = getDependencyMap(this.analyzerContext.graph)
        this.analyzerContext.circularImports = getCircularImports(this.analyzerContext.dependencyMap)

        return this.analyzerContext
	}
}
