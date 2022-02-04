import express from 'express'
// import { notFound, errorHandler, requestHandler, corsHandler } from '~MIDDLEWARES'
import { routes } from '../routes'

export class ServerService {
  private readonly PORT_HTTP = global.config.port || 3000
  private app = express()

  constructor() {
    this.middlewares()
    this.routes()
  }

  private middlewares(): void {
    // this.app.use('/', requestHandler)
    // this.app.use(corsHandler())
    this.app.use(express.json())
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
