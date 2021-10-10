import graphviz from "graphviz"

export async function createDotGraph(graph: Record<string, string[]>) {
  const g = graphviz.digraph("G")

  for (const consumerPath in graph) {
    const n = g.addNode(consumerPath, { color: "blue" })

    const dependencies = graph[consumerPath]
    for (const dep of dependencies) {
      g.addEdge(n, dep, { color: "red" })
    }
  }

  return g.to_dot()
}
