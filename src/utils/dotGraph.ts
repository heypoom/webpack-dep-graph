import { digraph, Graph } from "graphviz"
import { writeFile } from "./files"

// https://renenyffenegger.ch/notes/tools/Graphviz/examples/index
export function createDotGraph(
	dependencyMap: Record<string, string[]>
): Graph {
	const g: Graph = digraph("G")

	for (const consumerPath in dependencyMap) {
		const n = g.addNode(consumerPath, { color: "blue" })

		const dependencies = dependencyMap[consumerPath]
		for (const dep of dependencies) {
			g.addEdge(n, dep, { color: "red" })
		}
	}

	return g
}

/** TODO fix */
export function saveGraphvizRenderedDot(g: Graph, fileName: string = 'graph.dot'){
    g.output( "dot", fileName );
}

/** !!! very long execution time */
export function saveGraphvizRenderedPng(g: Graph, fileName: string = 'graph.png'){
    g.output( "png", fileName );
}

export function saveGraphvizDotSimplified(g: Graph, fileName: string = 'graph_text.dot'){
	// const json = JSON.stringify(data, null, 2)
	writeFile(fileName, g.to_dot())  
}
