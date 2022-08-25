import { AnalyzerContext } from "../models/AnalyzerContext"
import { resolvePath } from "../parsers/moduleParser"
import { getAbsolutePath, fileNameFromPath } from "../parsers/pathParser"
import { v4 } from "uuid"

const debug = (text: string) => console.debug(text)

export function createModuleNodes(context: AnalyzerContext) {
  const { graph, vfs, projectRoot, webpackModules } = context
console.log('src/analyzer/analyzerUtils/setupNodes.ts', context.graph.dependenciesById.size)
  const startTime = Date.now()
  debug(`located ${webpackModules.length} modules from this build.`)

  // Construct graph nodes from the module.
  for (const module of webpackModules) {
    const id = v4()

    const relativePath = resolvePath(module.name)
    const absolutePath = getAbsolutePath(module, projectRoot)

    graph.nodeIdByRelativePath.set(relativePath, id)

    graph.nodesById.set(id, {
      id,
      webpackModuleId: module.id || -1,
      sizeInBytes: module.size,
      fileName: fileNameFromPath(module.name),
      relativePath,
      absolutePath,
    })

    // Register the path with the virtual file system.
    vfs.touch(absolutePath, id)
  }

  debug(`creating module nodes takes ${Date.now() - startTime}ms.`)

  return graph;
}
