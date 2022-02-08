import { Router, Request, Response } from 'express'
import { MainController } from '~CONTROLLERS/Main.controller'

const router = Router()

router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        fromNumber,
        chat: {
          contact: { displayName }
        },
        body
      } = req.body.data

      new MainController({
        phone: fromNumber,
        username: displayName,
        message: body,
        res
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
