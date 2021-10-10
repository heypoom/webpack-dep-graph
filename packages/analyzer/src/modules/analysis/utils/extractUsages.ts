import { AnalyzerContext, cleanupModuleName, isAppKey } from "@analyzer"
import { gray, green, yellow } from "colorette"

export function extractUsages(context: AnalyzerContext) {
  const { webpackModules, graph, printImportAnalysis = false } = context

  const report = (text: string) => printImportAnalysis && console.debug(text)

  report(`\n------- analyzing imports and re-exports ------\n`)

  for (const webpackModule of webpackModules) {
    const summary = { imports: 0, exports: 0, issuers: 0 }
    const resolvedDependents: Map<string, boolean> = new Map()

    const relativePath = cleanupModuleName(webpackModule.name)

    const module = graph.byRelativePath(relativePath)
    if (!module) throw new Error("cannot lookup by relative path")

    report(yellow(`module ${module.absolutePath}`))

    const reasons = webpackModule?.reasons?.filter((m) =>
      isAppKey(m.resolvedModule)
    )

    // Use the webpack import/export reason to resolve dependency chain
    for (const reason of reasons) {
      // Ignore side effect evaluation.
      if (reason.type.includes("side effect")) continue

      const moduleName = cleanupModuleName(reason.resolvedModule)

      // Mark dependent as resolved, so we don't need to resolve multiple times.
      if (resolvedDependents.has(moduleName)) continue
      resolvedDependents.set(moduleName, true)

      // Resolve the module that utilizes/consumes the current module.
      const consumerModule = graph.byRelativePath(moduleName)
      if (!consumerModule) continue

      // Detect if the module is a being re-exported.
      const isExport = reason.type.includes("export imported specifier")
      const { absolutePath } = consumerModule

      if (isExport) {
        report(green(`  re-exported by ${absolutePath}`))
        summary.exports++

        continue
      }

      graph.addDependency(consumerModule.id, module.id)

      report(`  imported by ${absolutePath}`)
      summary.imports++
    }

    const issuers =
      webpackModule.issuerPath?.filter((issuer) => isAppKey(issuer.name)) ?? []

    for (const issuer of issuers) {
      const module = graph.byRelativePath(issuer.name)
      if (!module) continue

      report(gray(`  issued by ${module.absolutePath}`))
      summary.issuers++
    }

    report(
      `  summary: ${summary.imports} imports, ${summary.exports} re-exports, ${summary.issuers} issuers`
    )
  }
}
