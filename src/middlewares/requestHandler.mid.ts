import { Request, NextFunction } from 'express'
import { botDebug } from '~UTILS/debug.util'

export function requestHandler(req: Request, _, next: NextFunction): void {
  botDebug(`HTTP-IN : ${req.method} ${req.originalUrl}`)
  next()
}
