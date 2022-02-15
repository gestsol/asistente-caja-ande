import { WassiService } from '~SERVICES/Wassi.service'
import { botDebug } from '~UTILS/debug.util'
import { getConfig } from '~UTILS/config.util'

export class SessionService {
  private wassi?: WassiService
  private timer?: NodeJS.Timeout

  constructor() {
    this.startDatabase()
  }

  public async login(phone: string): Promise<void> {
    if (!this.wassi) this.wassi = new WassiService()

    const session = SessionService.getSession(phone)

    if (session) {
      // Transferir los datos de la sesion a variables super globales
      // para tener facil acceso a ellas dentro de los controladores
      AFFILIATE = session.affiliate
      TREE_LEVEL = session.treeLevel
      TREE_STEP = session.treeStep

      // Se reinicia el temporizador del cierre de sesión
      this.timer!.refresh()
    } else {
      // Crear nueva sesion
      global.SESSIONS.push({
        phone: phone,
        affiliate: AFFILIATE,
        treeLevel: TREE_LEVEL,
        treeStep: TREE_STEP
      })
      this.autoLogout(phone)

      botDebug('SESSION', 'session started')
      await this.notifySession(phone, 'Sesión iniciada ✅')
    }
  }

  public autoLogout(phone: string): void {
    this.timer = setTimeout(async () => {
      this.startDatabase()

      botDebug('SESSION', 'session ended')
      await this.notifySession(phone, 'Sesión finalizada 🕒')
    }, 1000 * 60 * getConfig().timerSessionMin)
  }

  public static update(phone: string): void {
    const session = SessionService.getSession(phone)

    if (session) {
      session.treeLevel = TREE_LEVEL
      session.treeStep = TREE_STEP
      session.affiliate = AFFILIATE

      botDebug('SESSION', session)
    }
  }

  private startDatabase(): void {
    // Iniciar variables super globales
    global.AFFILIATE = null
    global.TREE_LEVEL = 'MAIN'
    global.TREE_STEP = ''
    // TODO: Por ahora se usan variables super globales para almacenar las sesiones.
    // Pero esto debe ser almacenado en una DB local (json o sqlite)
    global.SESSIONS = []
  }

  private static getSession(phone: string): TSession | null {
    const session = SESSIONS.find((session) => session.phone === phone)
    return session || null
  }

  private async notifySession(phone: string, message: string): Promise<void> {
    if (getConfig().messageSession) {
      await this.wassi!.sendMessage(phone, message)
    }
  }
}
