import { digraph } from "graphviz"
import { writeFile } from "./files"

export function createDotGraph(
	dependencyMap: Record<string, string[]>
): string {
	const g = digraph("G")

	for (const consumerPath in dependencyMap) {
		const n = g.addNode(consumerPath, { color: "blue" })

		const dependencies = dependencyMap[consumerPath]
		for (const dep of dependencies) {
			g.addEdge(n, dep, { color: "red" })
		}
	}

	return g.to_dot()
}

export function saveDot(fileName: string, data: any) {
	const json = JSON.stringify(data, null, 2)
	writeFile(fileName, json)
}
