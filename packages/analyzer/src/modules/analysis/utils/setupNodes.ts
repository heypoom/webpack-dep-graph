import { v4 } from "uuid"

import {
  AnalyzerContext,
  cleanupModuleName,
  fileNameFromPath,
  getAbsolutePath,
} from "@analyzer"

export function createModuleNodes(context: AnalyzerContext) {
  const { graph, vfs, projectRoot, webpackModules } = context

  const startTime = Date.now()
  console.debug(`located ${webpackModules.length} modules from this build.`)

  // Construct graph nodes from the module.
  for (const module of webpackModules) {
    const id = v4()

    const relativePath = cleanupModuleName(module.name)
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

  console.debug(`creating module nodes takes ${Date.now() - startTime}ms.`)
}
