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
    const { fromNumber, body } = req.body.data as TWassiRequest['data']

    try {
      new MainController({
        phone: fromNumber,
        message: convertMessageInUppercase(body),
        res,
        menuHome: OPTIONS_HOME
      })
    } catch (error) {
      next(error)
    }
  }
)

export { router as wassiRoutes }
