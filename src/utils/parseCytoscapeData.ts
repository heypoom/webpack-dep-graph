/** see src/viewer/node_modules/@types/cytoscape/index.d.ts:83 */
interface ICyElementDefinition {
	data: ICyNodeDataDefinition | ICyEdgeDataDefinition
}

interface ICyNodeDataDefinition {
	[id: string]: any
}

interface ICyEdgeDataDefinition {
	source: string
	target: string
	[id: string]: any
}

function parseNode(id: string, label: string = ""): ICyElementDefinition {
	return { data: { [id]: label } }
}

function parseEdge(
	id: string,
	source: string,
	target: string,
	label: string = "",
): ICyElementDefinition {
	return {
		data: { [id]: label, source, target },
	}
}

export function parseElementDefinitions(
	dependencyMap: Record<string, string[]>
): ICyElementDefinition[] {

    let result: ICyElementDefinition[] = []

    for (const targetPath in dependencyMap) {
		const targetNode = parseNode(targetPath)

		const dependenciesPaths = dependencyMap[targetPath]
		for (const dependencyPath of dependenciesPaths) {
			parseEdge(targetPath, dependencyPath, targetPath)
		}
	}

    return result
}
