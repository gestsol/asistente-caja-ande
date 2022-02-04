import { Router, Request, Response } from 'express'
import { MainController } from 'controllers/Main.controller'
import { WassiService } from '~SERVICES/Wassi.service'

const router = Router()

router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    const wassi = new WassiService()
    const mainController = new MainController(req.body.data)

    const message = await mainController.startDecisionTree()

    await wassi.sendMessage(req.body.data.fromNumber, message)

    res.end()
  }
)

export { router as wassiRoutes }
