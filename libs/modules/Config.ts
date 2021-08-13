import fs from 'fs'
import os from 'os'
import path from 'path'
import { searchDefault } from '~/libs/const/search'
import { configFile } from '~/libs/const/utils'
import BaseModule from '~/libs/modules/BaseModule'

export default class Config extends BaseModule {
  #data: IfConfigFile

  constructor(ops: { ext?: string; dir?: string }) {
    super()

    const file = this.#readFile()
    this.#data = {
      search: file.search,
      ext: ops.ext || file.ext || 'html',
      dir: ops.dir || file.dir || 'dist'
    }
  }

  public targetExt(): string {
    return this.#data.ext as string
  }

  public targetDir(): string {
    return this.#data.dir as string
  }

  public searchProperties(): TSearch[] {
    return this.#data.search
  }

  /** Read for configuration file */
  #readFile = (): IfConfigFile => {
    const project = path.join(process.cwd(), configFile)
    if (fs.existsSync(project)) {
      return JSON.parse(fs.readFileSync(project, 'utf8'))
    }

    const global = path.join(os.homedir(), configFile)
    if (fs.existsSync(global)) {
      return JSON.parse(fs.readFileSync(global, 'utf8'))
    }

    // default
    return {
      search: searchDefault
    }
  }
}
