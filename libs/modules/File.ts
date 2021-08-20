import fs from 'fs'
import { blue, green } from 'kleur'
import path from 'path'
import pug from 'pug'
import BaseModule from '~/libs/modules/BaseModule'
import { homepage, version } from '../../package.json'

interface IfFileDataBlock {
  filename: string
  result: {
    key: string
    value?: string | null
    image?: string
  }[]
}

const pugOps: pug.Options = {
  doctype: 'html'
}

export default class File extends BaseModule {
  readonly #body

  constructor(result: IfSearchResult[]) {
    super()

    const fn = pug.compileFile(
      path.join(__dirname, 'templates', 'base.pug'),
      pugOps
    )
    const htmlItems = this.#html(result)

    this.#body = fn({
      htmlItems,
      project: path.dirname(homepage),
      homepage,
      version
    })
  }

  /**
   * Result write
   * @param output - directory
   */
  public write(output: string): void {
    try {
      const file = `${path.join(output, 'result.html')}`
      fs.writeFileSync(file, this.#body)

      console.log(green().bold(`\nCompleted file wrote.`))
      console.log(`Output: ${blue().bold(file)}`)
    } catch (e) {
      this.exit(e)
    }
  }

  /**
   * Type HTML
   * @param result
   */
  #html = (result: IfSearchResult[]): IfFileDataBlock[] => {
    const items = result.filter((d) => d.type === 'html')
    const block: IfFileDataBlock[] = []

    items.forEach((item) => {
      const blockArr: IfFileDataBlock['result'] = []

      item.data.forEach((_i) =>
        blockArr.push({ key: _i.key, value: _i.value, image: _i.image })
      )

      block.push({ filename: item.filename, result: blockArr })
    })

    return block
  }
}
