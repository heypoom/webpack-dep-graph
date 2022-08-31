import { Analyzer } from "./analyzer/Analyzer"
import { AnalyzerContext } from "./analyzer/models/AnalyzerContext"
import { createDotGraph, saveGraphvizRenderedDot, saveGraphvizDotSimplified, saveGraphvizRenderedPng } from "./utils/dotGraph"
import { loadWebpackStat } from "./utils/webpackStats"
import { parseEdgeDefinitions, saveCytoscape } from "./utils/cytoscape"
import { writeFile } from "./utils/files"
import { loadGraphml, saveGraphml } from "./utils/graphml"

function main() {
	let analyzerContext: AnalyzerContext
	const statFileName = process.argv[2] || "webpack-stats.json"
	console.log(`\n------- loading ${statFileName} ------\n`)

	const webpackStat = loadWebpackStat(statFileName)
	const grapml = loadGraphml("1.graphml")

	if (webpackStat) {
		const analyzer = new Analyzer(webpackStat)
		analyzerContext = analyzer.analyze()

		console.log(`\n------- displaying file tree ------\n`)
		// printFileTree(analyzerContext)
		const dotGraph = createDotGraph(analyzerContext.dependencyMap)
		const cytoscapeGraph = parseEdgeDefinitions(
			analyzerContext.dependencyMap
		)

		saveGraphml("2.graphml", grapml)
		saveCytoscape("./deps.json", analyzerContext.dependencyMap)
		saveCytoscape("./circular.json", analyzerContext.circularImports)
		saveCytoscape("./cytoscape.json", cytoscapeGraph)
		saveGraphvizRenderedDot(dotGraph, "./graph.dot")
		saveGraphvizRenderedPng(dotGraph, "./graph.png")
		saveGraphvizDotSimplified(dotGraph, "./graph_text.dot")
	}
}

main()
