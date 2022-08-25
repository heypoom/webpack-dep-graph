import filesize from "filesize"
import { AnalyzerContext } from "../models/AnalyzerContext"

export function printFileTree(context: AnalyzerContext) {
  const { vfs, graph } = context

  vfs.printTree(vfs.root, (type, name, id) => {
    if (type === "file" && id) {
      let displayName = name

      const module = graph.nodesById.get(id)
      if (!module) return name

      // Display file sizes in the tree.
      const size = module.sizeInBytes
      displayName = `${name} (${filesize(size)})`

      // TODO: Highlight large modules.
      // if (size > 30000) {
      //   displayName = bold(red(displayName))
      // } else if (size > 20000) {
      //   displayName = redBright(displayName)
      // }

      return displayName
    }

    return name
  })
}
