import { Request, Response, NextFunction, Handler } from 'express'
import { SessionService } from '~SERVICES/Session.service'
import { getConfig } from '~UTILS/config.util'
import { botDebug } from '~UTILS/debug.util'

export function sessionHandler(): Handler {
  const sessionService = new SessionService()

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        data: { fromNumber, body, type },
        device: { phone }
      } = req.body as TWassiRequest

      // Validar la data del body de la petición POST en modo API
      if (getConfig().modeAPP === 'API' && (!fromNumber || (type === 'text' && !body))) {
        throw new Error('Body is incorrect')
      }

      // Descartar el número del bot entre los usuarios que escriben
      if (fromNumber === phone) res.end()
      else {
        botDebug('WASSI-IN', `${fromNumber} -> ${body || type}`)

        // Se crea una nueva sesión o se retorna la existente
        const session = await sessionService.login(fromNumber)
        req.app.set('session', session)

        next()
      }
    } catch (error) {
      next(error)
    }
  }
}
