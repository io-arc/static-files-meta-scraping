import downloadsFolder from 'downloads-folder'
import fs from 'fs'
import path from 'path'
import pug from 'pug'
import BaseModule from '~/libs/modules/BaseModule'
import { homepage, version } from '../../package.json'

interface IfFileDataBlock {
  filename: string
  result: {
    key: string
    value?: string | null
  }[]
}

const pugOps: pug.Options = {
  doctype: 'html'
}

export default class File extends BaseModule {
  readonly #body

  constructor(result: IfSearchResult[], properties: TSearch[]) {
    super()

    const fn = pug.compileFile(
      path.join(__dirname, 'templates', 'base.pug'),
      pugOps
    )
    const htmlItems = this.#html(result, properties)

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
  public write(output?: string) {
    fs.writeFileSync(
      `${path.join(output || downloadsFolder(), 'result.html')}`,
      this.#body
    )
  }

  /**
   * Type HTML
   * @param result
   * @param properties
   */
  #html = (
    result: IfSearchResult[],
    properties: TSearch[]
  ): IfFileDataBlock[] => {
    const items = result.filter((d) => d.type === 'html')
    const block: IfFileDataBlock[] = []

    items.forEach((item) => {
      const blockArr: IfFileDataBlock['result'] = []

      properties.forEach((property) => {
        const _d = item.data.filter((d) => d.key === property.target)

        const v: string[] = []
        _d.forEach((d) => v.push(d.value))

        blockArr.push({ key: property.target, value: v.join('<br>') })
      })

      block.push({ filename: item.filename, result: blockArr })
    })

    return block
  }
}
