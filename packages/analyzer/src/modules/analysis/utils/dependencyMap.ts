import { ModuleGraph } from "@analyzer"

export function createDependencyMap(graph: ModuleGraph) {
  const mapping: Record<string, string[]> = {}
  const toPath = (id: string) => graph.nodesById.get(id)?.absolutePath ?? ""

  for (const [id, dependencies] of graph.dependenciesById) {
    mapping[toPath(id)] = Array.from(dependencies).map(toPath)
  }

  return mapping
}
