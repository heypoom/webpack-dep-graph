import { bold, redBright } from "colorette"
import fs from "fs"
import { IWebpackStatsV5 } from "src/analyzer/models/webpack5.model"

export function loadWebpackStat(fileName: string): IWebpackStatsV5 {
  const startTime = Date.now()

  try {
    // console.log('src/utils/loadWebpackStat.ts:9', fileName);
    const statString = fs.readFileSync(fileName, "utf-8")

    const stat: IWebpackStatsV5 = JSON.parse(statString)
    console.debug(`loading stat.json takes ${Date.now() - startTime}ms.`)

    return stat
  } catch (error) {
    console.error(
      bold(redBright(`unable to read webpack stat file: ${fileName}`))
    )

    console.error(error)
  }
}
