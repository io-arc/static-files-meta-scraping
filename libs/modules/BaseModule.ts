import { bold, red } from 'kleur'

export default class BaseModule {
  protected exit(error?: Error): void {
    console.log(red('Oops X('))
    if (error) {
      console.log(red(JSON.stringify(error)))
    }
    process.exit(1)
  }

  protected terminate(): void {
    console.log(bold('Bye !'))
    process.exit(0)
  }
}
