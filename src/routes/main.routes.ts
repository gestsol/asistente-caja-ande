import { Router, Response } from 'express'
import fs from 'fs'
import { resolve } from 'path'
import { AndeService } from '~SERVICES/Ande.service'

const router = Router()

router.get(
  '/',
  async (_, res: Response): Promise<void> => {
    const pkg = JSON.parse(fs.readFileSync(resolve('package.json'), 'utf8'))
    const loginResponse = await new AndeService().loginAdmin()

    res.status(200).json({
      statusBot: 'OK',
      statusCajaAnde:
        typeof loginResponse === 'object' && loginResponse.token ? 'OK' : 'ERROR: Caja Ande service does not respond',
      version: pkg.version,
      name: pkg.name,
      description: pkg.description,
      dateServer: new Date().toISOString()
    })
  }
)

export { router as mainRoutes }
