import { red } from 'kleur'

export default class BaseModule {
  protected exit(error?: Error): void {
    console.log(red('Oops X('))
    if (error) {
      console.log(red(JSON.stringify(error)))
    }
    process.exit(1)
  }
}
