import { Request, Response, NextFunction } from 'express'
import { getConfig } from '~UTILS/config.util'

export function errorCatch(error: Error, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    console.error('ERROR-HANDLING-EXPRESS:', error)
    // Error handling is delegated to Express
    return next(error)
  } else {
    // Mostrar error en consola si sucede un error 500
    if (req.statusCode === 500) console.error('ERROR-SERVER:', error)
  }

  // Si esta en modo BOT contestar al webhook con status 200 para que no reenvie el mensaje
  const status = getConfig().modeAPP === 'BOT' ? 200 : req.statusCode || 500

  // Error handling personalized
  res.status(status).json({
    error: {
      type: error.name,
      message: error.message
    }
  })
}
