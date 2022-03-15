import { Router, Request, Response, NextFunction } from 'express'
import { MainController } from '~CONTROLLERS/Main.controller'
import { sessionHandler } from '~MIDDLEWARES'
import { convertMessageInUppercase } from '~UTILS/message.util'
import { getConfig } from '~UTILS/config.util'

const router = Router()

router.post(
  '/',
  sessionHandler(),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { body, type, media, location } = req.body.data as TWassiRequest['data']

    try {
      new MainController({
        message: body ? convertMessageInUppercase(body) : '',
        dataType: type,
        file: media
          ? {
              id: media.id,
              size: media.size,
              mime: media.mime,
              extension: media.extension
            }
          : null,
        location: location || null,
        res,
        session: req.app.get('session') as TSession
      })

      if (getConfig().modeAPP === 'BOT') res.end()
    } catch (error) {
      next(error)
    }
  }
)

export { router as wassiRoutes }
