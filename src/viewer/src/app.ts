import fs from "fs"
import type {
	EdgeDataDefinition,
	ElementDefinition,
	NodeDataDefinition,
	Stylesheet,
} from "cytoscape"
import cytoscape from "cytoscape"
const elements: ElementDefinition[] = []
const cyStyle: Stylesheet[] = [
	{
		selector: "node",
		style: {
			"background-color": "#111",
			label: "data(id)",
			color: "#b8e994",
			"border-color": "#b8e994",
			"border-width": "2",
			"text-valign": "center",
			"text-halign": "center",
		},
	},

	{
		selector: "edge",
		style: {
			width: "2",
			"line-color": "#757575",
			"target-arrow-color": "#757575",
			"target-arrow-shape": "triangle",
			"curve-style": "bezier",
		},
	},
]

function main() {
	const fileName = "cytoscape.json"
	const statString = fs.readFileSync(fileName, "utf-8")
	const elements: { data: NodeDataDefinition | EdgeDataDefinition }[] =
		JSON.parse(statString)
	// console.log(`\n------- loading ${statFileName} ------\n`)
	const container: HTMLElement | null = document.querySelector(".app-view")

	if (fileName) {
		const cy = cytoscape({
			elements: elements,
			container: container,
			hideEdgesOnViewport: true,
			textureOnViewport: true,
			motionBlur: true,
			style: cyStyle,
		})
	}
}

main()
