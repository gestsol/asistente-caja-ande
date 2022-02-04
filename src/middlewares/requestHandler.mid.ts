import { Request, NextFunction } from 'express'
import { debug } from '~UTILS/debug.util'

export function requestHandler(req: Request, _, next: NextFunction): void {
  debug(`${req.method} ${req.originalUrl}`)
  next()
}
