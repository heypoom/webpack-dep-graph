import { IWebpackStatsV5 } from "src/analyzer/models/webpack5.model"
import { readFile } from "./files"

export function loadWebpackStat(fileName: string): IWebpackStatsV5 {
	const statString = readFile(fileName)

	const stat: IWebpackStatsV5 = JSON.parse(statString)

	return stat
}

