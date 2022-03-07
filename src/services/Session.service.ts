import { WassiService } from '~SERVICES/Wassi.service'
import { botDebug } from '~UTILS/debug.util'
import { getConfig } from '~UTILS/config.util'
import { AndeService } from '~SERVICES/Ande.service'

export class SessionService extends WassiService {
  constructor() {
    super()
    this.startDatabase()
  }

  public async login(phone: string): Promise<void> {
    const session = SessionService.getSession(phone)

    if (session) {
      // Transferir los datos de la sesion a variables super globales
      // para tener facil acceso a ellas dentro de los controladores
      TREE_LEVEL = session.treeLevel
      TREE_STEP = session.treeStep
      ANDE = session.ande
      STORE = session.store
    } else {
      const isAdmin = getConfig().adminPhomeList.includes(phone)

      if (isAdmin) {
        // Nueva sesión para usuario ADMIN
        const loginData = await new AndeService().login(getConfig().affiliate)

        // Inicializacion de valores globales para usuario ADMIN
        TREE_LEVEL = 'HOME'
        TREE_STEP = ''
        ANDE = {
          affiliate: loginData!.afiliado,
          token: loginData!.token
        }
        STORE = {} as TStore
      } else {
        // Nueva sesión para usuario normal
        this.initGlobalValues()
      }

      // Crear nueva sesión
      SESSIONS.push({
        phone,
        treeLevel: TREE_LEVEL,
        treeStep: TREE_STEP,
        ande: ANDE,
        store: STORE
      })

      if (!isAdmin) {
        botDebug('SESSION', 'session started')
        if (getConfig().messageSession) {
          await this.sendMessage({ phone, message: '✅ Sesión iniciada' })
        }
      }
    }
  }

  public static update(phone: string, dateUpdated?: string): void {
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

      // Actualizar sesión
      SESSIONS = [...sessions, sessionUpdated]

      const sessionDebug = {
        phone: sessionUpdated.phone,
        treeLevel: sessionUpdated.treeLevel,
        treeStep: sessionUpdated.treeStep
      }

      if (!dateUpdated) {
        botDebug('SESSION', 'session updated', sessionDebug)
        console.log()
      }
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
    global.STORE = {} as TStore
  }

  private static getSession(phone: string): TSession | null {
    const session = SESSIONS.find(session => session.phone === phone)
    return session || null
  }
}
