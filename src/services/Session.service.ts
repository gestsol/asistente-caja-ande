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
      ANDE = session.ande
      TREE_LEVEL = session.treeLevel
      TREE_STEP = session.treeStep
      STORE = session.store

      // Se reinicia el temporizador del cierre de sesión
      this.timer!.refresh()
    } else {
      this.initGlobalValues()

      // Crear nueva sesión
      SESSIONS.push({
        phone,
        treeLevel: TREE_LEVEL,
        treeStep: TREE_STEP,
        ande: null,
        store: {}
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
      const sessions = SESSIONS.filter(session => session.phone !== phone)

      const sessionUpdated: TSession = {
        phone,
        treeLevel: TREE_LEVEL,
        treeStep: TREE_STEP,
        ande: ANDE,
        store: STORE
      }

      TREE_LEVEL = session.treeLevel
      TREE_STEP = session.treeStep
      ANDE = session.ande
      // Actualizar sesión
      SESSIONS = [...sessions, sessionUpdated]

      botDebug('SESSIONS', SESSIONS)
    }
  }

  private startDatabase(): void {
    this.initGlobalValues()

    // TODO: Por ahora se usa una variable super globale para almacenar las sesiones.
    // Pero en el futuro esto debe ser almacenado en una DB local (json o sqlite) o remota (mongo, postgress)
    global.SESSIONS = []
  }

  private initGlobalValues(): void {
    // Inicializacion de valores globales
    global.TREE_LEVEL = 'MAIN'
    global.TREE_STEP = ''
    global.ANDE = null
    global.STORE = {}
  }

  private static getSession(phone: string): TSession | null {
    const session = SESSIONS.find(session => session.phone === phone)
    return session || null
  }

  private async notifySession(phone: string, message: string): Promise<void> {
    if (getConfig().messageSession) {
      await this.wassi!.sendMessage(phone, message)
    }
  }
}
