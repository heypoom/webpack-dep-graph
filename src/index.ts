import fs from "fs"
import { Analyzer } from "./analyzer/Analyzer"
import { AnalyzerContext } from "./analyzer/models/AnalyzerContext"
import { createDotGraph } from "./utils/dotGraph"
import { parseElementDefinitions } from "./utils/parseCytoscapeData"

import { loadWebpackStat } from "./utils/loadWebpackStat"

const write = (path: string, json: unknown) =>
	fs.writeFileSync(path, JSON.stringify(json, null, 2))

function main() {
	let analyzerContext: AnalyzerContext
	const statFileName = process.argv[2] || "webpack-stats.json"
	console.log(`\n------- loading ${statFileName} ------\n`)

	const webpackStat = loadWebpackStat(statFileName)

	if (webpackStat) {
		const analyzer = new Analyzer(webpackStat)
		analyzerContext = analyzer.analyze()

		console.log(`\n------- displaying file tree ------\n`)
		// printFileTree(analyzerContext)
		const dotGraph = createDotGraph(analyzerContext.dependencyMap)
		const cytoscapeGraph = parseElementDefinitions(analyzerContext.dependencyMap)

        write("./deps.json", analyzerContext.dependencyMap)
		write("./circular.json", analyzerContext.circularImports)
		write("./graph.dot", dotGraph)
        write("./cytoscape.json", cytoscapeGraph)
	}
}

main()
