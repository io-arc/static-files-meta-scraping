import cheerio from 'cheerio'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
import { regExt, regImageExt } from '~/libs/const/utils'
import BaseModule from '~/libs/modules/BaseModule'

interface IfSearchItem {
  ext: string
  files: string[]
}

export default class Search extends BaseModule {
  readonly #dir: string = ''
  readonly #files: string[] = []

  constructor(dir: string, ext: string) {
    super()

    const files = glob.sync(`${dir}/**/*.${/,/.test(ext) ? `{${ext}}` : ext}`)
    this.#files = this.#sort(files)
    this.#dir = dir
  }

  public exec(searchProperties: TSearch[], root: string): IfSearchResult[] {
    if (this.#files.length === 0) {
      // TODO: end
      return []
    }

    const pickupExt = (file: string): string | undefined => {
      const reg = regExt.exec(file)
      if (reg == null) return

      return reg[0]
    }

    const result: IfSearchResult[] = []

    // TODO: progress

    this.#files.forEach((file) => {
      const ext = pickupExt(file)
      if (ext == null) return

      const body = fs.readFileSync(file, 'utf8')
      const filename = file.replace(`${this.#dir}/`, '')

      switch (ext) {
        case '.css':
          // TODO: CSS
          return
        default:
          // HTML
          const data = this.#html(body, searchProperties, root)
          result.push({ filename, type: 'html', data })
          return
      }
    })

    return result
  }

  /**
   * Sort files by extension.
   * 1. extension
   * 2. directory is shallow
   *
   * @param files
   */
  #sort = (files: string[]) => {
    return files.sort((a, b) => {
      const rA = regExt.exec(a)
      const rB = regExt.exec(b)

      if (!rA) {
        if (!rB) return a > b ? -1 : 1
        return -1
      } else if (!rB) {
        return 1
      }

      const aE = rA[0]
      const bE = rB[0]

      if (aE !== bE) return aE > bE ? -1 : 1

      return a > b ? -1 : 1
    })
  }

  /**
   * HTML file
   * @param body
   * @param properties
   * @param root
   */
  #html = (
    body: string,
    properties: TSearch[],
    root: string
  ): IfSearchResult['data'] => {
    const $ = cheerio.load(body)
    const data: IfSearchResult['data'] = []

    properties.forEach((property) => {
      const nodes = $(property.target)

      // Could not find it
      if (nodes.length === 0) return

      const attr = this.#attr(property)

      Array.from(nodes).forEach((node) => {
        const value = attr == null ? $(node).text() : $(node).attr(attr)
        if (value == null) return

        // Images
        if (/ \d(.*)[a-zA-Z]/.test(value)) {
          // e.g. srcset="xxx 1x, xxx 2x", srcset="xxx 100vw, xxx 200w"
          const arr = value.split(', ')
          arr.forEach((a) => {
            const p = a.replace(/ \d(.*)[a-zA-Z]/, '')
            const image = this.#image(p, root)
            data.push({ key: property.target, value: p, image })
          })
        } else {
          const image = this.#image(value, root)
          data.push({ key: property.target, value, image })
        }
      })
    })

    return data
  }

  // TODO: cssの場合はbackground,background-imageを抽出
  #css = (body: string) => {
    console.log(body)
  }

  /**
   * Get value of search tag
   * Null is tag content
   * @param property
   */
  #attr = (property: TSearch): string | null => {
    if (property.value != null) {
      if (property.value === '') return null
      return property.value
    }

    // <meta>
    if (/^meta/.test(property.target)) return 'content'

    // <link>
    if (/^link/.test(property.target)) return 'href'

    // <a>
    if (/^a/.test(property.target)) return 'href'

    // <img>
    if (/^img\[srcset/.test(property.target)) return 'srcset'
    if (/^img/.test(property.target)) return 'src'

    // <source>
    if (/^source/.test(property.target)) return 'src'

    // <video>
    if (/^video/.test(property.target)) return 'src'

    return null
  }

  /**
   * Get base64 string
   * @param value
   * @param root
   */
  #image = (value: string, root: string): string | undefined => {
    if (!regImageExt.test(value)) return

    value = value.replace(/https?:\/\/(.*?)\//, '').replace(/\?[^.]+$/, '')
    if (!/^\//.test(value)) value = `/${value}`
    const reg = new RegExp(`^${root}`)
    value = value.replace(reg, '')
    const targetPath = path.join(this.#dir, value)

    if (!fs.existsSync(targetPath)) return 'oops'

    const base64 = fs.readFileSync(targetPath, 'base64')
    const mime = this.#mime(targetPath)

    if (mime == null) return 'unknown'

    return `data:${mime};base64,${base64}`
  }

  /**
   * Image MIME
   * @param targetPath
   */
  #mime = (targetPath: string): string | undefined => {
    const ext = targetPath.match(regExt)

    if (ext == null) return

    switch (ext[0].toLocaleLowerCase()) {
      case '.png':
        return 'image/png'
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg'
      case '.gif':
        return 'image/gif'
      case 'webp':
        return 'image/webp'
      case '.svg':
        return 'image/svg+xml'
      default:
        return
    }
  }
}
