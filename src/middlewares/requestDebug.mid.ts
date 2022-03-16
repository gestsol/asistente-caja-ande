import { Request, NextFunction } from 'express'
import { botDebug } from '~UTILS/debug.util'

export function requestDebug(req: Request, _, next: NextFunction): void {
  const isStartApi = req.originalUrl.startsWith('/api')

  if (isStartApi) {
    botDebug('HTTP-IN', `${req.method} ${req.originalUrl}`)
  }

  if (req.method === 'POST') {
    const {
      data: { fromNumber },
      device: { phone }
    } = req.body as TWassiRequest

    if (fromNumber !== phone) {
      botDebug('HTTP-IN', `${req.method} ${req.originalUrl}`)
    }
  }

  next()
}
