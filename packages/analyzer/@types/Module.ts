export interface Module {
  id: string

  // Webpack Module Id (Numeric)
  webpackModuleId: number

  // Size in bytes.
  sizeInBytes: number

  // File Name.
  fileName: string

  // Relative File Path
  relativePath: string

  // Absolute File Path
  absolutePath: string
}
