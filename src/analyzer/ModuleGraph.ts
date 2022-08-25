import { Module } from "./models/Module"

export class ModuleGraph {
  /** Lookup the module by id. */
  nodesById: Map<string, Module> = new Map()

  /** Lookup the module's id by its relative path. */
  nodeIdByRelativePath: Map<string, string> = new Map()

  /**
   * Lookup the module ids that is being used by the given module.
   *
   * It's an adjacency list containing the module ids,
   * which can be represented as a directed acyclic graph (DAG).
   *
   * e.g. `{"id:LoginPage": ["id:LoginForm", "id:LoginButton"]}`,
   **/
  dependenciesById: Map<string, Set<string>> = new Map()

  /** Lookup the module ids that re-exports the given module. */
  exportedBy: Map<string, Set<string>> = new Map()

  /** Lookup the module ids that issues the given module. */
  issuedBy: Map<string, Set<string>> = new Map()

  byRelativePath(relativePath: string): Module | null {
    const id = this.nodeIdByRelativePath.get(relativePath)
    if (!id) return null

    const module = this.nodesById.get(id)
    if (!module) return null

    return module
  }

  addDependenciesById(consumerId: string, dependencyId: string) {
    if (!this.dependenciesById.has(consumerId)) {
      this.dependenciesById.set(consumerId, new Set())
    }

    this.dependenciesById.get(consumerId)?.add(dependencyId)
  }
}
