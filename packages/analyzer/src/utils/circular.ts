/**
 * Source: https://github.com/pahen/madge/blob/master/lib/cyclic.js
 */
export function getCircularImports(graph: Record<string, string[]>) {
  const circular: string[][] = []

  const resolved: Record<string, boolean> = {}
  const unresolved: Record<string, boolean> = {}

  function getPath(parent: string) {
    let visited = false

    return Object.keys(unresolved).filter((module) => {
      if (module === parent) visited = true

      return visited && unresolved[module]
    })
  }

  function resolve(id: string) {
    unresolved[id] = true

    if (graph[id]) {
      graph[id].forEach((dependency) => {
        if (!resolved[dependency]) {
          if (unresolved[dependency]) {
            const paths = getPath(dependency)

            return circular.push(paths)
          }

          resolve(dependency)
        }
      })
    }

    resolved[id] = true
    unresolved[id] = false
  }

  Object.keys(graph).forEach(resolve)

  return circular
}
