import express from 'express'
import { requestHandler, sessionHandler } from '~MIDDLEWARES'
import { routes } from '~ROUTES'
import { getConfig } from '~UTILS/config.util'

export class ServerService {
  private readonly PORT_HTTP = getConfig().port || 3000
  private app = express()

  constructor() {
    this.middlewares()
    this.routes()
  }

  private middlewares(): void {
    this.app.use('*', requestHandler)
    this.app.use(express.json())
    this.app.use(sessionHandler())
  }

  private routes(): void {
    this.app.use('*', routes)
  }

  public start(): void {
    this.app.listen(this.PORT_HTTP, () => {
      console.log(`BOT: listening on http://localhost:${this.PORT_HTTP}`)
    })
  }
}
