import fs from 'fs'
import os from 'os'
import path from 'path'
import { searchDefaultConfig } from '~/libs/const/search'
import { configFile } from '~/libs/const/utils'
import BaseModule from '~/libs/modules/BaseModule'

export default class Config extends BaseModule {
  readonly #data = searchDefaultConfig

  constructor(ops: IfCommandOptions) {
    super()
    const file = this.#readFile()
    if (file != null) {
      this.#data = { ...this.#data, ...file }
    }

    // overwrite
    if (ops.ext != null) this.#data.ext = ops.ext
    if (ops.dir != null) this.#data.dir = ops.dir
    if (ops.root != null) this.#data.root = ops.root
    if (ops.find != null) this.#data.find = ops.find
    if (ops.output != null) this.#data.output = ops.output
  }

  public targetExt(): string {
    return this.#data.ext
  }

  public targetDir(): string {
    return this.#data.dir
  }

  public targetFind(): string | undefined {
    return this.#data.find
  }

  public searchProperties(): TSearch[] {
    return this.#data.search
  }

  public rootPath(): string {
    return this.#data.root
  }

  public output(): string {
    return this.#data.output
  }

  /** Read for configuration file */
  #readFile = (): IfConfigFile | null => {
    const project = path.join(process.cwd(), configFile)
    if (fs.existsSync(project)) {
      return JSON.parse(fs.readFileSync(project, 'utf8'))
    }

    const global = path.join(os.homedir(), configFile)
    if (fs.existsSync(global)) {
      return JSON.parse(fs.readFileSync(global, 'utf8'))
    }

    // default
    return null
  }
}
