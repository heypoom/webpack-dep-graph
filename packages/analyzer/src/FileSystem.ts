/** Map directory name to directory. */
type DirTree = Map<string, Directory>

interface Directory {
  folders: DirTree

  /** Map file name to module id. */
  files: Map<string, string>
}

class VirtualFS {
  folders: DirTree = new Map()

  mkdir(path: string) {
    const segments = path.split("/")
    let node: DirTree = this.folders

    for (const directory of segments) {
      if (!node.has(directory)) {
        node.set(directory, { folders: new Map(), files: new Map() })
      }

      const child = node.get(directory)!
      node = child.folders
    }
  }

  dirOf(path: string): Directory | null {
    const segments = path.split("/")
    let node: DirTree = this.folders

    for (const directory of segments.slice(0, -1)) {
      if (!node.has(directory)) return null

      const child = node.get(directory)!
      node = child.folders
    }

    const [folder] = segments.slice(-1)

    return node.get(folder)
  }

  touch(path: string, id = ""): Directory {
    const segments = path.split("/")
    const paths = segments.slice(0, -1)
    const [file] = segments.slice(-1)

    const folder = paths.join("/") || "."
    this.mkdir(folder)

    const dir = this.dirOf(folder)
    dir.files.set(file, id)

    return dir
  }
}
const vfs = new VirtualFS()
vfs.mkdir("libs/module-a/src/module-b/blocks")

const dir = vfs.touch("libs/module-a/src/module-b/constants.ts")
vfs.touch("hello.txt")
vfs.mkdir("root")
vfs.folders //?
