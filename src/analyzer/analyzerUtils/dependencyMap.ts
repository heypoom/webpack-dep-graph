import { ModuleGraph } from "../ModuleGraph"

export function getDependencyMap(graph: ModuleGraph): Record<string, string[]> {
  const mapping: Record<string, string[]> = {}
  const toPath = (id: string) => graph.nodesById.get(id)?.absolutePath ?? ""

  for (const [id, dependencies] of graph.dependenciesById) {
    mapping[toPath(id)] = Array.from(dependencies).map(toPath)
  }
console.log('src/analyzer/analyzerUtils/dependencyMap.ts:10', mapping.length, graph.dependenciesById.size);
  return mapping
}
