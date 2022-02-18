import { NextFunction, Request } from 'express'

export function notFound(req: Request, _, next: NextFunction): void {
  req.statusCode = 404

  next({
    name: 'Not Found',
    message: `Can't find ${req.originalUrl} on this server`
  })
}
