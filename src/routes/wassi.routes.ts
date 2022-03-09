import { Router, Request, Response, NextFunction } from 'express'
import { MainController } from '~CONTROLLERS/Main.controller'
import { sessionHandler } from '~MIDDLEWARES'
import { convertMessageInUppercase } from '~UTILS/message.util'
import { OPTIONS_HOME } from '~ENTITIES/consts'

const router = Router()

router.post(
  '/',
  sessionHandler(),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { fromNumber, body, type, media, location } = req.body.data as TWassiRequest['data']

    try {
      new MainController({
        phone: fromNumber,
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
        menuHome: OPTIONS_HOME
      })
    } catch (error) {
      next(error)
    }
  }
)

export { router as wassiRoutes }
