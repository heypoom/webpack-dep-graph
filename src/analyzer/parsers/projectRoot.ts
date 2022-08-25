import { IWebpackStatsV5Module } from "../models/webpack5.model"
import { isAppSourcesPath } from "./filterModule"

export function getProjectRoot(modules: IWebpackStatsV5Module[]) {
  const refModule = modules.find(
    (m) => isAppSourcesPath(m.name) && /node_modules/.test(m.issuer)
  )

  if (!refModule) return null

  const [projectRoot] = refModule.issuer.split("node_modules")
  if (!projectRoot) return null

  console.debug("absolute project root might be at", projectRoot)

  return projectRoot
}
