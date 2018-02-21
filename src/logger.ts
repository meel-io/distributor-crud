import * as pino from 'pino'

export class Logger {
  private log: any

  constructor() {
    this.log = pino()
  }

  public info(content: any) {
    this.log.info(content)
  }

  public error(content: any) {
    this.log.info(content)
  }
}
