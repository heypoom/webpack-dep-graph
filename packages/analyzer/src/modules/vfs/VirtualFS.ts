interface Directory {
  /** Map file name to module id. */
  files: Map<string, string>

  /** Map directory name to directory. */
  folders: Map<string, Directory>
}

type WalkHandle = (dir: Directory, folderName: string) => void

type FormatterFn = (
  type: "folder" | "file",
  name: string,
  moduleId?: string
) => string

const createDirectory = (): Directory => ({
  files: new Map(),
  folders: new Map(),
})

export class VirtualFS {
  root: Directory = createDirectory()

  mkdir(path: string): Directory {
    return this.walkPath(path, (dir, name) => {
      if (dir.folders.has(name)) return

      dir.folders.set(name, createDirectory())
    })
  }

  dir(path: string): Directory {
    return this.walkPath(path, () => {})
  }

  walkPath(path: string, handle: WalkHandle): Directory {
    if (!path) return this.root

    const segments = path.split("/")
    let dir: Directory = this.root

    for (const directory of segments) {
      handle(dir, directory)
      dir = dir.folders.get(directory)!
    }

    return dir
  }

  printTree(root = this.root, formatter?: FormatterFn) {
    function traverse(dir: Directory, depth = 0) {
      const spacer = " ".repeat(depth * 2)

      for (const [folderName, directory] of dir.folders) {
        let displayName = folderName

        // Format the directory name.
        if (formatter) displayName = formatter("folder", folderName)

        // TODO: Show the directory name in yellow.
        // console.log(yellow(`${spacer}${displayName}/`))

        traverse(directory, depth + 1)
      }

      for (const [fileName, moduleId] of dir.files) {
        let displayName = fileName

        // Format the file name.
        if (formatter) displayName = formatter("file", fileName, moduleId)

        // TODO: Highlight index files in green.
        // if (/index\.tsx?/.test(fileName)) displayName = green(fileName)

        console.log(`${spacer}${displayName}`)
      }
    }

    traverse(root)
  }

  touch(path: string, id = ""): Directory {
    // Do not create the directory if the path is missing.
    if (!path) return this.root

    const segments = path.split("/")
    const paths = segments.slice(0, -1)
    const [file] = segments.slice(-1)

    const folder = paths.join("/")
    const dir = this.mkdir(folder)

    dir.files.set(file, id)

    return dir
  }
}

// const vfs = new VirtualFS()

// vfs.touch("hello.txt") //?
// vfs.mkdir("src/modules")
// vfs.touch("config/production.json") //?
// vfs.dir("config") //?
// vfs.root //?

// vfs.scan()
