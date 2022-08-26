import { logEmpty } from "../../utils/logger";
import { ModuleGraph } from "../ModuleGraph"

export function getDependencyMap(graph: ModuleGraph): Record<string, string[]> {
  const mapping: Record<string, string[]> = {}
  const toPath = (id: string) => graph.nodesById.get(id)?.relativePath || ""

  for (const [id, dependencies] of graph.dependenciesById) {
    mapping[toPath(id)] = Array.from(dependencies).map(toPath)
  }

  logEmpty('src/analyzer/analyzerUtils/dependencyMap.ts:10', mapping?.length?.toString());
  return mapping
}
