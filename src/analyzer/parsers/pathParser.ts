import { logEmpty } from "../../utils/logger"
import { IWebpackStatsV5Module } from "../models/webpack5.model"

export function parseAbsolutePath(module: IWebpackStatsV5Module): string {
	let path = module.identifier?.split("!")[1] || ""

	logEmpty("src/analyzer/parsers/pathParser.ts:6", module.name)

	return path
}

export function fileNameFromPath(path: string) {
	const [name]: string[] = path.split("/").slice(-1)
	logEmpty("src/analyzer/parsers/pathParser.ts:17", path)
	return name
}
