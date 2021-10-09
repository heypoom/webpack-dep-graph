import fs from 'fs'
import {v4} from 'uuid'
import {rest, uniq} from 'lodash'

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

  // IDs of the module that depends on this module.
  dependentIds: number[]
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

const isAppModule = (module: WebpackModule) =>
  !/cache|webpack|node_modules/.test(module.name)

const getIssuerModuleId = (issuerPath: WebpackIssuerPath, stat: WebpackStat): number | null => {
  if (issuerPath.id) return issuerPath.id

  const issuerModule = stat.modules.find(m => m.name === issuerPath.name)
  if (!issuerModule) return null

  return issuerModule.id
}

const cleanupModuleName = (name: string) => {
  if (!name) return ''
  if (!name.includes('+')) return name

  const [segment] = name.split(' + ') ?? []
  if (!segment) return name

  return segment.trim()
}

class ModuleGraph {
  nodesById: Map<string, Module> = new Map()
  nodeIdByRelativePath: Map<string, string> = new Map()

  byRelativePath(relativePath: string) {
    const id = this.nodeIdByRelativePath.get(relativePath)
    if (!id) throw new Error('cannot find id by relativePath')

    const module = this.nodesById.get(id)
    if (!module) throw new Error('cannot find module by id')

    return module
  }
}

const fileNameFromPath = (path: string) => {
  const segments = path.split('/')

  return segments[segments.length - 1]
}

const exists = <T>(x: T | null): x is T => !!x

const getAbsolutePath = (module: WebpackModule, projectRoot: string) =>
  cleanupModuleName(module.nameForCondition?.replace(projectRoot, ''))

async function readConfiguration() {
  const startTime = Date.now()
  const fileName = './webpack-stats.json'

  const statString = await fs.promises.readFile(fileName, 'utf-8')
  const stat: WebpackStat = JSON.parse(statString)

  console.debug(`loading stat.json takes ${Date.now() - startTime}ms.`)

  return stat
}

async function main() {
  console.log(`\n------- PHASE 1 ------\n`)

  const stat = await readConfiguration()
  const appModules = stat.modules.filter(isAppModule)

  const graph = new ModuleGraph()
  const startTime = Date.now()

  const refModule = appModules.find(m => /node_modules/.test(m.issuer))
  if (!refModule) return

  const [prefix] = refModule.issuer.split('node_modules')
  console.log('[heuristic] absolute project root might be at', prefix)

  // Construct graph nodes from the module.
  for (const module of appModules) {
    const id = v4()

    const dependentIdsByIssuer = module.issuerPath
      ?.map(path => getIssuerModuleId(path, stat))
      .filter(exists) ?? []

    const dependentIds = uniq([...dependentIdsByIssuer])
    const relativePath = cleanupModuleName(module.name)

    graph.nodeIdByRelativePath.set(relativePath, id)

    const absolutePath = getAbsolutePath(module, prefix)
    // console.debug(`registered ${absolutePath}.`)

    graph.nodesById.set(id, {
      id,
      webpackModuleId: module.id || -1,
      sizeInBytes: module.size,
      fileName: fileNameFromPath(module.name),
      relativePath,
      absolutePath,
      dependentIds
    })
  }

  console.debug(`creating module graph nodes takes ${Date.now() - startTime}ms.`)

  console.log(`\n------- PHASE 2 ------\n`)

  // Construct dependents from import reason.
  for (const webpackModule of appModules) {
    const resolvedDependents: Map<string, boolean> = new Map()

    const relativePath = cleanupModuleName(webpackModule.name)
    const module = graph.byRelativePath(relativePath)

    console.log(`module ${module.absolutePath}`)

    const reasons = webpackModule?.reasons
      ?.filter(m => !/cache|webpack|node_modules/.test(m.resolvedModule))

    for (const reason of reasons) {
      const moduleName = cleanupModuleName(reason.resolvedModule)

      // Ignore side effect evaluation.
      if (reason.type.includes('side effect')) {
        continue
      }

      // Mark dependent as resolved, so we don't need to resolve multiple times.
      if (resolvedDependents.has(moduleName)) continue
      resolvedDependents.set(moduleName, true)

      let isExport = false

      if (reason.type.includes('export imported specifier')) { 
        isExport = true
      } else if (reason.type.includes('import specifier')) {
        // ...
      }



      // Resolve module path to module identifier in the registry.
      const moduleIdByPath = graph.nodeIdByRelativePath.get(moduleName)
      if (!moduleIdByPath) {
        console.error(`    error! missing ${moduleName} in mapping`)
        continue
      }

      // Resolve module id to module
      const moduleByPath = graph.nodesById.get(moduleIdByPath)
      if (!moduleByPath) throw new Error('what the fuck')

      const action = isExport ? 'exported' : 'imported'
      console.log(`  ${action} by ${moduleByPath.absolutePath}`)
    }
  }

  // Construct graph edges from the resolved modules
  // for (const module of graph.nodesById.values()) {
  //   const dependents = module.dependentIds.map(id => graph.nodesById.get(id)).filter(exists)

  //   if (dependents.length > 0) {
  //     console.log(`deps for ${module.absolutePath} =`, dependents.map(m => m?.absolutePath))
  //   }
  // }
}

main()

