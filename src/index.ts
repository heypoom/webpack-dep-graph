import fs from "fs"
// import { promises as fsPromises } from 'fs';

import { Analyzer } from "./analyzer/Analyzer"
import { getCircularImports, getDependencyMap } from "./analyzer/analyzerUtils"
import { AnalyzerContext } from "./analyzer/models/AnalyzerContext"

import { loadWebpackStat } from "./utils/loadWebpackStat"

const write = (path: string, json: unknown) =>
	fs.writeFileSync(path, JSON.stringify(json, null, 2))

function main() {
    let analyzerContext: AnalyzerContext
	const statFileName = process.argv[2] || "webpack-stats.json"
	console.log(`\n------- loading ${statFileName} ------\n`)

	const webpackStat = loadWebpackStat(statFileName)
	if (!webpackStat) return

	const analyzer = new Analyzer(webpackStat)
	analyzerContext = analyzer.analyze()

	console.log(`\n------- displaying file tree ------\n`)
	// printFileTree(analyzerContext)

	write("./deps.json", analyzerContext.dependencyMap)

	write("./circular.json", analyzerContext.circularImports)
}

main()
