import { writeFile } from "fs/promises"

import { Analyzer, printFileTree } from "@analyzer"

import { loadWebpackStat } from "./utils/loadWebpackStat"

const write = (path: string, json: unknown) =>
  writeFile(path, JSON.stringify(json, null, 2))

async function main() {
  const statFileName = process.argv[2] || "webpack-stats.json"
  console.log(`\n------- loading ${statFileName} ------\n`)

  const webpackStat = await loadWebpackStat(statFileName)
  if (!webpackStat) return

  const analyzer = new Analyzer(webpackStat)
  analyzer.analyze()

  console.log(`\n------- displaying file tree ------\n`)

  printFileTree(analyzer.context)

  await write("./deps.json", analyzer.dependencies)
  await write("./circular.json", analyzer.circularImports)
}

main()
