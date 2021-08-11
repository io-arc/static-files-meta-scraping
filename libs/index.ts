import { program } from 'commander'
import { bold, green } from 'kleur/colors'
import updateNotifier from 'update-notifier'
import { name, version } from '../package.json'

/** Checking library version */
updateNotifier({ pkg: { name, version } }).notify()

/** end command */
process.stdin.resume()
process.on('SIGINT', (): void => {
  console.log(bold(green('Bye !')))
  process.exit(0)
})

/** Library command */
program.version(version).parse(process.argv)

/** exec */
;(async (): Promise<void> => {
  process.exit(0)
})()
