import { Router, Request, Response } from 'express'
import { MainController } from '~CONTROLLERS/Main.controller'
import { sessionHandler } from '~MIDDLEWARES'
import { messageSanitize } from '~UTILS/message.util'
import { OPTIONS_HOME } from '~ENTITIES/consts'

const router = Router()

router.post(
  '/',
  sessionHandler(),
  async (req: Request, res: Response): Promise<void> => {
    const { fromNumber, body } = req.body.data as TWassiData

    try {
      new MainController({
        phone: fromNumber,
        message: messageSanitize(body),
        res,
        menuHome: OPTIONS_HOME
      })
    } catch (error) {
      console.error('ERROR:', error)

      res.status(500).json({
        status: 'Error',
        error: (error as Error).message
      })
    }
  }
)

export { router as wassiRoutes }
