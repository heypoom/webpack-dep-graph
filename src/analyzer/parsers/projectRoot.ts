import { IWebpackStatsV5Module } from "../models/webpack5.model"
import { isAppSourcesPath } from "./filterModule"

/** @deprecated TODO remove unused code */
export function getAppRootPath(modules: IWebpackStatsV5Module[]) {
	let rootPath: string = ""
	const appModule = modules.find(
		(module: IWebpackStatsV5Module) =>
			isAppSourcesPath(module.name) && /node_modules/.test(module.issuer)
	)

	if (appModule) {
		rootPath =
			appModule.issuer.split("node_modules")[0] ||
			appModule.issuer.split("node_modules")[0] ||
			""
	}

	if (!rootPath) {
		console.warn(
			"src/analyzer/parsers/projectRoot.ts:19",
			"EMPTY app root path!",
			appModule.name
		)
	}

    return rootPath
}
