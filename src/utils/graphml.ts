import { ElementCompact, js2xml, xml2js } from "xml-js"
import { readFile, writeFile } from "./files"
// import { create } from "xmlbuilder"

export function toGraphml(js: ElementCompact): string {
	// const xml = create(js).end({ pretty: true })
	const xml: string = js2xml(js, { compact: false, spaces: 4 })

	return xml
}

export function fromGraphml(xml: string): ElementCompact {
	const js: ElementCompact = xml2js(xml, { compact: false })

	return js
}

export function loadGraphml(fileName: string): { [key: string]: string } {
	const statString = readFile(fileName)

	const stat: { [key: string]: string } = fromGraphml(statString)

	return stat
}

export function saveGraphml(fileName: string, data: { [key: string]: string }) {
	const stat: string = toGraphml(data)

	writeFile(fileName, stat)
}