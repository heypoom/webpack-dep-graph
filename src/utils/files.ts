import fs from "fs"

export function readFile(fileName: string): string {
	const startTime = Date.now()
	try {
		// console.log('src/utils/loadWebpackStat.ts:9', fileName);
		const statString = fs.readFileSync(fileName, "utf-8")

		console.debug(`loading stat.json takes ${Date.now() - startTime}ms.`)

		return statString
	} catch (error) {
		console.error(`unable to read webpack stat file: ${fileName}`, error)
	}
}

export function writeFile(path: string, data: any) {
	fs.writeFileSync(path, data)
}
