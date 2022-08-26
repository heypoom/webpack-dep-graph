import { logEmpty } from "../../utils/logger"

export const resolvePathPlus = (name: string) => {
	let result = name

	if (typeof name === "string" && name.length) {
		result = name.split(" + ")[0]
	}

	logEmpty("src/analyzer/parsers/moduleParser.ts:8", name)

    return result
}
