import { cleanupModuleName, WebpackModule } from "@analyzer"

export const getAbsolutePath = (module: WebpackModule, projectRoot: string) =>
  cleanupModuleName(module.nameForCondition?.replace(projectRoot, ""))

export const fileNameFromPath = (path: string) => {
  const segments = path.split("/")

  return segments[segments.length - 1]
}
