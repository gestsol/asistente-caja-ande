import { Request, NextFunction } from 'express'
import { getConfig } from '~UTILS/config.util'
import { botDebug } from '~UTILS/debug.util'

export function requestDebug(req: Request, _, next: NextFunction): void {
  const isStartApi = req.originalUrl.startsWith('/api')
  const phone = req.body?.data?.fromNumber

  if (isStartApi || (req.method === 'POST' && phone && phone !== getConfig().nroBot)) {
    botDebug('HTTP-IN', `${req.method} ${req.originalUrl}`)
  }

  next()
}
