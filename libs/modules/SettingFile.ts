import fs from 'fs'
import inquirer from 'inquirer'
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
  public async write(): Promise<void> {
    try {
      const file = `${path.join(this.#dir, configFile)}`

      if (fs.existsSync(file)) {
        const confirm = await this.#confirm()
        if (!confirm) {
          this.terminate()
          return
        }
      }

      const json = JSON.stringify(this.#preset(), null, 2)

      fs.writeFileSync(file, json)
      console.log(green().bold('Create a config file.'))
      console.log(`Saved in: ${blue(file)}`)
    } catch (e) {
      this.exit(e)
    }
  }

  /** If there is an existing file */
  #confirm = async (): Promise<boolean> => {
    try {
      const res = await inquirer.prompt<{ confirm: boolean }>({
        type: 'confirm',
        name: 'confirm',
        message: 'The file already exists, do you want to overwrite it?',
        default: false
      })
      return res.confirm
    } catch (e) {
      this.exit(e)
      return false
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
