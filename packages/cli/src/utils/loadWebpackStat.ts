import { WebpackStat } from "@analyzer"
import { bold, redBright } from "colorette"
import { readFile } from "fs/promises"

export async function loadWebpackStat(fileName: string) {
  const startTime = Date.now()

  try {
    const statString = await readFile(fileName, "utf-8")

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
