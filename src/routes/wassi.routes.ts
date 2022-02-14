import { Router, Request, Response } from 'express'
import { MainController } from '~CONTROLLERS/Main.controller'
import { messageSanitize } from '~UTILS/message.util'
import { OPTIONS_HOME } from '~ENTITIES/consts'

const router = Router()

router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { fromNumber, body } = req.body.data

      new MainController({
        phone: fromNumber,
        message: messageSanitize(body),
        res,
        menuHome: OPTIONS_HOME
      })
    } catch (error) {
      res.status(400).json({
        status: 'Error',
        error: (error as Error).message
      })
    }
  }
)

export { router as wassiRoutes }
