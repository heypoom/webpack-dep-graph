interface Directory {
  /** Map file name to module id. */
  files: Map<string, string>

  /** Map directory name to directory. */
  folders: Map<string, Directory>
}

type WalkHandle = (dir: Directory, folderName: string) => void

const createDirectory = (): Directory => ({
  files: new Map(),
  folders: new Map(),
})

class VirtualFS {
  root: Directory = createDirectory()

  mkdir(path: string): Directory {
    return this.walk(path, (dir, name) => {
      if (dir.folders.has(name)) return

      dir.folders.set(name, createDirectory())
    })
  }

  dir(path: string): Directory {
    return this.walk(path, () => {})
  }

  walk(path: string, handle: WalkHandle): Directory {
    if (!path) return this.root

    const segments = path.split("/")
    let dir: Directory = this.root

    for (const directory of segments) {
      handle(dir, directory)
      dir = dir.folders.get(directory)!
    }

    return dir
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
