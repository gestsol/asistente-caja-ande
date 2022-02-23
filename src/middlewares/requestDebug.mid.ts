import { Request, NextFunction } from 'express'
import { botDebug } from '~UTILS/debug.util'

export function requestDebug(req: Request, _, next: NextFunction): void {
  const isStartApi = req.originalUrl.startsWith('/api')

  if (isStartApi || (req.method === 'POST' && req.body?.data?.fromNumber)) {
    botDebug('HTTP-IN', `${req.method} ${req.originalUrl}`)
  }

  next()
}
