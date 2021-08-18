import { program } from 'commander'
import downloadsFolder from 'downloads-folder'
import { bold, italic } from 'kleur'
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
  .option(
    '-d, --dir <directory>',
    `Search target output directory. (default: ${italic('dist')})`
  )
  .option(
    '-f, --find <directories>',
    `Specify a directory to be further targeted from the target directories.
Comma separated if there are multiple directories. (default: ${italic(
      'undefined'
    )})
e.g. en,ja`
  )
  .option(
    '-r, --root <actual root path>',
    `When searching for images, specify if the output file is different from the actual root path. (default: ${italic(
      '/'
    )})`
  )
  .option(
    '-o, --output <directory>',
    `Specifies the directory to output the result files. (default: ${italic(
      downloadsFolder()
    )})`
  )
  .parse(process.argv)

/** exec */
;(async (ops): Promise<void> => {
  /** exec */
  const config$ = new Config(ops)
  const search$ = new Search(
    config$.targetDir(),
    config$.targetExt(),
    config$.targetFind()
  )

  const result = search$.exec(config$.searchProperties(), config$.rootPath())

  if (result.length === 0) {
    process.exit(0)
    return
  }

  const file$ = new File(result)
  file$.write(config$.output())

  process.exit(0)
})(program.opts<IfCommandOptions>())
