import { Router, Request, Response } from 'express'
import { MainController } from '~CONTROLLERS/Main.controller'
import { messageSanitize } from '~UTILS/message.util'

const router = Router()

router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { fromNumber, body } = req.body.data

      startStoreTemp(fromNumber)

      new MainController({
        phone: fromNumber,
        message: messageSanitize(body),
        res,
        menuHome: `
        (11) Préstamos 💰
        (12) Tarjetas de crédito 💳
        (13) Consultar crédito vigente 🧐
        (14) Noticias e informaciones del mes 📱
        (15) Datos personales 😊
        (16) Descargas 🤗
        (17) Link de interés 😄
        (18) Mesa de entrada`
      })
    } catch (error) {
      res.status(400).json({
        status: 'Error',
        error: (error as Error).message
      })
    }
  }
)

// TODO: Por ahora se usan variables super globales para almacenar las sesiones
// y otros datos importante que recordar. Pero esto debe ser almacenado en una DB local (json o sqlite)
function startStoreTemp(phone: string): void {
  const session = global.SESSIONS.find((session) => session.phone === phone)

  if (session) {
    // Desbordar datos de la sesion dentro de variables super globales
    AFFILIATE = session.affiliate
    TREE_LEVEL = session.treeLevel
    TREE_STEP = session.treeStep
  } else {
    // Iniciar variables super globales
    global.AFFILIATE = null
    global.TREE_LEVEL = 'MAIN'
    global.TREE_STEP = ''

    // Crear nueva sesion
    global.SESSIONS.push({
      phone: phone,
      affiliate: AFFILIATE,
      treeLevel: TREE_LEVEL,
      treeStep: TREE_STEP
    })
  }
}

export { router as wassiRoutes }
