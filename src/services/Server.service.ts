import express from 'express'
import { requestHandler, errorCatch, notFound } from '~MIDDLEWARES'
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
  }

  private routes(): void {
    this.app.use('/api', routes.mainRoutes)
    this.app.use(routes.wassiRoutes)
    this.app.use(notFound)
    this.app.use(errorCatch)
  }

  public start(): void {
    this.app.listen(this.PORT_HTTP, () => {
      console.log(`BOT: listening on http://localhost:${this.PORT_HTTP}`)
    })
  }
}
