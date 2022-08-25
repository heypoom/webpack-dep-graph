import { IWebpackStatsV5Module } from "../models/webpack5.model"
// import { WebpackModule } from "../models/WebpackStat"
import { resolvePath } from "./moduleParser"

export const getAbsolutePath = (module: IWebpackStatsV5Module, projectRoot: string) =>
  resolvePath(module.identifier?.replace(projectRoot, ""))

export const fileNameFromPath = (path: string) => {
  const segments = path.split("/")

  return segments[segments.length - 1]
}
