/** Map directory name to directory. */
type DirectoryMap = Map<string, Directory>

interface Directory {
  folders: DirectoryMap

  /** Map file name to module id. */
  files: Map<string, string>
}

type WalkHandle = (node: Directory, dir: string) => void

class VirtualFS {
  root: Directory = { folders: new Map(), files: new Map() }

  mkdir(path: string): Directory {
    return this.walk(path, (node, directory) => {
      if (!node.folders.has(directory)) {
        node.folders.set(directory, { folders: new Map(), files: new Map() })
      }
    })
  }

  dir(path: string): Directory {
    return this.walk(path, () => {})
  }

  walk(path: string, handle: WalkHandle): Directory {
    if (!path) return this.root

    const segments = path.split("/")
    let node: Directory = this.root

    for (const directory of segments) {
      handle(node, directory)
      node = node.folders.get(directory)!
    }

    return node
  }

  touch(path: string, id = ""): Directory {
    const segments = path.split("/")
    const paths = segments.slice(0, -1)
    const [file] = segments.slice(-1)

    const folder = paths.join("/")
    const dir = this.mkdir(folder)

    dir.files.set(file, id)

    return dir
  }
}
const vfs = new VirtualFS()

vfs.touch("hello.txt") //?
vfs.mkdir("src/modules")
vfs.touch("config/production.json") //?
vfs.dir("config") //?
vfs.root //?
