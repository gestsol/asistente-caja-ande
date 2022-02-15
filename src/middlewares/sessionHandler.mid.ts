import { Request, NextFunction, Handler } from 'express'
import { SessionService } from '~SERVICES/Session.service'

export function sessionHandler(): Handler {
  const session = new SessionService()

  return async (req: Request, _, next: NextFunction): Promise<void> => {
    try {
      const { fromNumber, body } = req.body.data as TWassiBody['data']

      if (!fromNumber || !body) throw new Error('Body is incorrect')

      await session.login(fromNumber)
      next()
    } catch (error) {
      next(error)
    }
  }
}
