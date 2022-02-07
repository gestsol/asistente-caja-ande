import { Router, Request, Response } from 'express'
import { MainController } from '~CONTROLLERS/Main.controller'

const router = Router()

router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    const {
      fromNumber,
      chat: {
        contact: { displayName }
      },
      body
    } = req.body.data

    const data = {
      phone: fromNumber,
      username: displayName,
      message: body
    }

    new MainController(data)

    res.end()
  }
)

export { router as wassiRoutes }
