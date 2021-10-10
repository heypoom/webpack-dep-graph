import fs from "fs"
import { v4 } from "uuid"
import { red, gray, yellow, green, bold, redBright } from "colorette"
import graphviz from "graphviz"

import { VirtualFS } from "@analyzer"
import filesize from "filesize"

interface Module {
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

interface WebpackReason {
  moduleIdentifier: string
  module: string
  moduleName: string
  resolvedModuleIdentifier: string
  resolvedModule: string
  type: string
  active: boolean
  explanation: string
  userRequest: string
  loc: string
  moduleId: string | null
  resolvedModuleId: string | null
}

interface WebpackModule {
  // Numeric Identifier used to identify the module.
  id: number

  name: string

  // Size in Bytes
  size: number

  // Absolute Path
  nameForCondition: string

  // Internal webpack identifier pointing to that module.
  identifier: string

  // The webpack identifier of the module that imports this module.
  issuer: string

  // Modules that import this file.
  issuerPath: WebpackIssuerPath[]

  reasons: WebpackReason[]
}

interface WebpackIssuerPath {
  id: number | null
  name: string
  identifier: string
}

interface WebpackStat {
  modules: WebpackModule[]
}

const isAppKey = (key: string) => !/cache|webpack|node_modules/.test(key)

const cleanupModuleName = (name: string) => {
  if (!name) return ""
  if (!name.includes("+")) return name

  const [segment] = name.split(" + ") ?? []
  if (!segment) return name

  return segment.trim()
}

class ModuleGraph {
  /** Lookup the module by id. */
  nodesById: Map<string, Module> = new Map()

  /** Lookup the module's id by its relative path. */
  nodeIdByRelativePath: Map<string, string> = new Map()

  /**
   * Lookup the module ids that is being used by the given module.
   *
   * It's an adjacency list containing the module ids,
   * which can be represented as a directed acyclic graph (DAG).
   *
   * e.g. `{"id:LoginPage": ["id:LoginForm", "id:LoginButton"]}`,
   **/
  dependenciesById: Map<string, Set<string>> = new Map()

  /** Lookup the module ids that re-exports the given module. */
  exportedBy: Map<string, Set<string>> = new Map()

  /** Lookup the module ids that issues the given module. */
  issuedBy: Map<string, Set<string>> = new Map()

  byRelativePath(relativePath: string): Module | null {
    const id = this.nodeIdByRelativePath.get(relativePath)
    if (!id) return null

    const module = this.nodesById.get(id)
    if (!module) return null

    return module
  }

  addDependency(consumerId: string, dependencyId: string) {
    if (!this.dependenciesById.has(consumerId)) {
      this.dependenciesById.set(consumerId, new Set())
    }

    this.dependenciesById.get(consumerId)?.add(dependencyId)
  }
}

const fileNameFromPath = (path: string) => {
  const segments = path.split("/")

  return segments[segments.length - 1]
}

const exists = <T>(x: T | null): x is T => !!x

const getAbsolutePath = (module: WebpackModule, projectRoot: string) =>
  cleanupModuleName(module.nameForCondition?.replace(projectRoot, ""))

async function loadWebpackStat(fileName: string) {
  const startTime = Date.now()

  try {
    const statString = await fs.promises.readFile(fileName, "utf-8")

    const stat: WebpackStat = JSON.parse(statString)
    console.debug(`loading stat.json takes ${Date.now() - startTime}ms.`)

    return stat
  } catch (error) {
    console.error(
      bold(redBright(`unable to read webpack stat file: ${fileName}`))
    )
    console.error(error)
  }
}

/**
 * Source: https://github.com/pahen/madge/blob/master/lib/cyclic.js
 */
function getCircularDeps(graph: Record<string, string[]>) {
  const circular: string[][] = []

  const resolved: Record<string, boolean> = {}
  const unresolved: Record<string, boolean> = {}

  function getPath(parent: string) {
    let visited = false

    return Object.keys(unresolved).filter((module) => {
      if (module === parent) visited = true

      return visited && unresolved[module]
    })
  }

  function resolve(id: string) {
    unresolved[id] = true

    if (graph[id]) {
      graph[id].forEach((dependency) => {
        if (!resolved[dependency]) {
          if (unresolved[dependency]) {
            const paths = getPath(dependency)
            console.log(
              bold(red("circular dependency:")),
              paths.join(" -> "),
              "\n"
            )

            return circular.push(paths)
          }

          resolve(dependency)
        }
      })
    }

    resolved[id] = true
    unresolved[id] = false
  }

  Object.keys(graph).forEach(resolve)

  return circular
}

async function main() {
  const statFileName = process.argv[2] || "webpack-stats.json"
  console.log(`\n------- loading ${statFileName} ------\n`)

  const stat = await loadWebpackStat(statFileName)
  if (!stat) return

  const appModules = stat.modules.filter((m) => isAppKey(m.name))

  const graph = new ModuleGraph()
  const vfs = new VirtualFS()

  const startTime = Date.now()

  const refModule = appModules.find((m) => /node_modules/.test(m.issuer))
  if (!refModule) return

  const [prefix] = refModule.issuer.split("node_modules")
  console.log("[heuristic] absolute project root might be at", prefix)
  console.log(`located ${appModules.length} modules from this build.`)

  // Construct graph nodes from the module.
  for (const module of appModules) {
    const id = v4()

    const relativePath = cleanupModuleName(module.name)
    const absolutePath = getAbsolutePath(module, prefix)

    graph.nodeIdByRelativePath.set(relativePath, id)

    graph.nodesById.set(id, {
      id,
      webpackModuleId: module.id || -1,
      sizeInBytes: module.size,
      fileName: fileNameFromPath(module.name),
      relativePath,
      absolutePath,
    })

    // Register the path with the virtual file system.
    vfs.touch(absolutePath, id)
  }

  console.debug(`initializing module nodes takes ${Date.now() - startTime}ms.`)

  console.log(`\n------- analyzing imports and exports ------\n`)

  // Construct dependents from import reason.
  for (const webpackModule of appModules) {
    const summary = { imports: 0, exports: 0, issuers: 0 }
    const resolvedDependents: Map<string, boolean> = new Map()

    const relativePath = cleanupModuleName(webpackModule.name)

    const module = graph.byRelativePath(relativePath)
    if (!module) throw new Error("cannot lookup by relative path")

    console.log(yellow(`module ${module.absolutePath}`))

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
        console.log(green(`  re-exported by ${absolutePath}`))
        summary.exports++

        continue
      }

      graph.addDependency(consumerModule.id, module.id)

      console.log(`  imported by ${absolutePath}`)
      summary.imports++
    }

    const issuers =
      webpackModule.issuerPath?.filter((issuer) => isAppKey(issuer.name)) ?? []

    for (const issuer of issuers) {
      const module = graph.byRelativePath(issuer.name)
      if (!module) continue

      console.log(gray(`  issued by ${module.absolutePath}`))
      summary.issuers++
    }

    console.log(
      `  summary: ${summary.imports} imports, ${summary.exports} re-exports, ${summary.issuers} issuers`
    )
  }

  console.log(`\n------- generating reports ------\n`)

  const totalCount = { nodes: 0, edges: 0 }

  const depGraph: Record<string, string[]> = {}
  const toPath = (id: string) => graph.nodesById.get(id)?.absolutePath ?? ""

  for (const [id, dependencies] of graph.dependenciesById) {
    depGraph[toPath(id)] = Array.from(dependencies).map(toPath)
  }

  await fs.promises.writeFile("./deps.json", JSON.stringify(depGraph, null, 2))

  const g = graphviz.digraph("G")

  for (const consumerPath in depGraph) {
    const n = g.addNode(consumerPath, { color: "blue" })
    totalCount.nodes++

    const dependencies = depGraph[consumerPath]
    for (const dep of dependencies) {
      g.addEdge(n, dep, { color: "red" })
      totalCount.edges++
    }
  }

  await fs.promises.writeFile("./deps.dot", g.to_dot())

  console.log(totalCount)

  console.log(`\n------- scanning for circular dependencies ------\n`)

  getCircularDeps(depGraph)

  console.log(`\n------- reconstructing file tree ------\n`)

  vfs.printTree(vfs.root, (type, name, id) => {
    if (type === "file" && id) {
      let displayName = name

      const module = graph.nodesById.get(id)
      if (!module) return name

      // Display file sizes in the tree.
      const size = module.sizeInBytes
      displayName = `${name} (${filesize(size)})`

      // Highlight large modules.
      if (size > 30000) {
        displayName = bold(red(displayName))
      } else if (size > 20000) {
        displayName = redBright(displayName)
      }

      return displayName
    }

    return name
  })
}

main()
