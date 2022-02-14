import { Request, NextFunction, Handler } from 'express'
import { SessionService } from '~SERVICES/Session.service'

export function sessionHandler(): Handler {
  const session = new SessionService()

  return async (req: Request, _, next: NextFunction): Promise<void> => {
    const { fromNumber } = req.body.data
    await session.login(fromNumber)
    next()
  }
}
