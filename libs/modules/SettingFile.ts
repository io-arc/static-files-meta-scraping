import fs from 'fs'
import { blue, green } from 'kleur'
import os from 'os'
import path from 'path'
import { searchDefaultConfig } from '~/libs/const/search'
import { configFile } from '~/libs/const/utils'
import BaseModule from '~/libs/modules/BaseModule'

export default class SettingFile extends BaseModule {
  readonly #dir: string

  constructor(type: boolean | string) {
    super()

    if (typeof type === 'boolean' && type) {
      this.#dir = process.cwd()
    } else {
      this.#dir = os.homedir()
    }
  }

  /**
   * Saving settings file
   */
  public write(): void {
    try {
      const file = `${path.join(this.#dir, configFile)}`
      const json = JSON.stringify(this.#preset(), null, 2)

      fs.writeFileSync(file, json)
      console.log(green().bold('Create a config file.'))
      console.log(`Saved in: ${blue(file)}`)
    } catch (e) {
      this.exit(e)
    }
  }

  /** Preset data */
  #preset = (): IfConfigFile => {
    const { search, dir, root } = searchDefaultConfig
    return {
      search,
      dir,
      root
    }
  }
}
