import { isAppKey, WebpackModule } from "@analyzer"

export function getProjectRoot(modules: WebpackModule[]) {
  const refModule = modules.find(
    (m) => isAppKey(m.name) && /node_modules/.test(m.issuer)
  )

  if (!refModule) return null

  const [projectRoot] = refModule.issuer.split("node_modules")
  if (!projectRoot) return null

  console.debug("absolute project root might be at", projectRoot)

  return projectRoot
}
