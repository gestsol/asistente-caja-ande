import { Router, Response } from 'express'

const router = Router()

router.get('/', (_, res: Response): void => {
  res.status(200).json({
    status: 'OK',
    date: new Date().toISOString()
  })
})

export { router as mainRoutes }
