import { program } from 'commander'
import { bold } from 'kleur'
import updateNotifier from 'update-notifier'
import Config from '~/libs/modules/Config'
import File from '~/libs/modules/File'
import Search from '~/libs/modules/Search'
import { name, version } from '../package.json'

/** Checking library version */
updateNotifier({ pkg: { name, version } }).notify()

/** end command */
process.stdin.resume()
process.on('SIGINT', (): void => {
  console.log(bold('Bye !'))
  process.exit(0)
})

/** Library command */
program
  .version(version)
  // TODO: TBD
  // .option(
  //   '-e, --ext <extensions>',
  //   'Search target extensions. e.g. html',
  //   undefined
  // )
  .option('-d, --dir <target directory>', 'Search target directory', undefined)
  .option('-r, --root <root path>', 'URL root path', undefined)
  .parse(process.argv)

/** exec */
;(async (ops): Promise<void> => {
  /** exec */
  const config$ = new Config({ ext: ops.ext, dir: ops.dir, root: ops.root })
  const search$ = new Search(config$.targetDir(), config$.targetExt())

  const result = search$.exec(config$.searchProperties(), config$.rootPath())

  if (result.length === 0) {
    process.exit(0)
    return
  }

  const file$ = new File(result)
  // TODO: Configで出力先を指定可能にする(デフォルトはdownloadディレクトリ)
  file$.write()

  process.exit(0)
})(program.opts<{ ext?: string; dir?: string; root?: string }>())
