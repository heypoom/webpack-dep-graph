import { AnalyzerContext } from "../models/AnalyzerContext"
import {
	IWebpackStatsV5Module,
	IWebpackStatsV5Reason,
} from "../models/webpack5.model"
// import { WebpackModule, WebpackReason } from "../models/WebpackStat"
import { isAppSourcesPath } from "../parsers/filterModule"
import { resolvePathPlus } from "../parsers/moduleParser"

function getModuleTypes(webpackModules: IWebpackStatsV5Module[]) {
	reasonTypes: webpackModules
		.map((m) => m.reasons.map((r) => r.type))
		.flat()
		.reduce(
			(acc, curr) => (acc.includes(curr) ? acc : acc.concat(curr)),
			[]
		)
}

export function extractUsages(context: AnalyzerContext) {
	const { webpackModules, graph, printImportAnalysis = false } = context

	const report = (text: string) => printImportAnalysis && console.log(text)

	report(`\n------- analyzing imports and re-exports ------\n`)

	const moduleTypes = getModuleTypes(webpackModules)

	const resolvedModules: IWebpackStatsV5Module[] = webpackModules.map((item) => {
		return {
			...item,
			issuerPath: item.issuerName,
			reasons: item.reasons.map((item) => ({
				...item,
				resolvedModulePath: resolvePathPlus(item.moduleName),
			})),
		}
	})

	for (const webpackModule of resolvedModules) {
		const summary = { imports: 0, exports: 0, issuers: 0 }
		const resolvedDependents: Map<string, boolean> = new Map()

		const relativePath = resolvePathPlus(webpackModule.name)

		const module = graph.byRelativePath(relativePath)
		if (!module) throw new Error("cannot lookup by relative path")

		// TODO: Re-enable this once we support web environments.
		// report(yellow(`module ${module.absolutePath}`))

		if (!(webpackModule?.reasons instanceof Array)) {
			continue
		}

		const reasons: Partial<IWebpackStatsV5Reason>[] =
			webpackModule?.reasons?.filter((m: IWebpackStatsV5Reason) => isAppSourcesPath(m.resolvedModulePath))

		// Use the webpack import/export reason to resolve dependency chain
		for (const reason of reasons) {
			// Ignore side effect evaluation.
			if (reason.type.includes("side effect")) {
				console.log(
					"src/analyzer/analyzerUtils/extractUsages.ts:34",
					reason.type
				)
				continue
			}

			const moduleName = resolvePathPlus(reason.resolvedModulePath)

			// Mark dependent as resolved, so we don't need to resolve multiple times.
			if (resolvedDependents.has(moduleName)) {
				continue
			}

			resolvedDependents.set(moduleName, true)

			// Resolve the module that utilizes/consumes the current module.
			const consumerModule = graph.byRelativePath(moduleName)
			if (!consumerModule) {
				continue
			}

			// Detect if the module is a being re-exported.
			const isExport = reason.type.includes("export imported specifier")
			const { absolutePath } = consumerModule

			if (isExport) {
				// report(green(`  re-exported by ${absolutePath}`))
				summary.exports++

				continue
			}

			graph.addDependenciesById(consumerModule.id, module.id)

			report(`  imported by ${absolutePath}`)
			summary.imports++
		}

		const issuers =
			webpackModule.reasons?.filter((issuer) =>
				isAppSourcesPath(issuer.moduleName)
			) ?? []

		for (const issuer of issuers) {
			const module = graph.byRelativePath(issuer.moduleName)
			if (!module) continue

			// report(gray(`  issued by ${module.absolutePath}`))
			summary.issuers++
		}

		report(
			`  summary: ${summary.imports} imports, ${summary.exports} re-exports, ${summary.issuers} issuers`
		)
	}
	console.log(
		"src/analyzer/analyzerUtils/extractUsages.ts:104",
		graph.dependenciesById.size
	)
	return graph
}
