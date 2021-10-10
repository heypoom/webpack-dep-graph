import graphviz from "graphviz"

export async function createDotGraph(graph: Record<string, string[]>) {
  const totalCount = { nodes: 0, edges: 0 }

  const g = graphviz.digraph("G")

  for (const consumerPath in graph) {
    const n = g.addNode(consumerPath, { color: "blue" })
    totalCount.nodes++

    const dependencies = graph[consumerPath]
    for (const dep of dependencies) {
      g.addEdge(n, dep, { color: "red" })
      totalCount.edges++
    }
  }

  console.debug(totalCount)

  return g.to_dot()
}
