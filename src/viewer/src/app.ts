// import fs from "fs"
import cytoscape from "cytoscape"
import type {
	EdgeDataDefinition,
	ElementDefinition,
	NodeDataDefinition,
	Stylesheet,
} from "cytoscape"
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

function draw() {
	const fileName = "cytoscape.json"
	// const statString = fs.readFileSync(fileName, "utf-8")
	// const elements: { data: NodeDataDefinition | EdgeDataDefinition }[] =
		// JSON.parse(statString)
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

function openFile() {
	let file: File = null
	const MAX_FILE_SIZE_BYTES = 1000 * 1000 * 10 // 10M
	let content: string | ArrayBuffer = null
	let fileReader: FileReader = new FileReader()
    const inputFileDOMElem: HTMLInputElement = document.querySelector('#inputFileDOMElem')
console.log('file open')
	if (
		inputFileDOMElem.files instanceof Array &&
		inputFileDOMElem.files.length > 0
	) {
		// file selected
		file = inputFileDOMElem.files[0]
	}
	if (
		file instanceof File &&
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
		["text/json"].includes(file.type) &&
		file.size <= MAX_FILE_SIZE_BYTES
	) {
		// get content
		fileReader.onload = function (e) {
			content = e?.target?.result
			console.log("file content", content)
		}

		// fire content reading
		fileReader.readAsText(file);
		// fileReader.readAsArrayBuffer(file)
	} else {
		console.log("wrong file")
	}
}
