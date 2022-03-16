import { botDebug } from '~UTILS/debug.util'
import { getConfig } from '~UTILS/config.util'
import { AndeService } from '~SERVICES/Ande.service'

export class SessionService {
  public static sessions: TSession[] = []

  constructor() {
    this.startDatabase()
  }

  public async login(phone: string): Promise<TSession> {
    const session = SessionService.getSession(phone)

    if (session) {
      // Se retorna la sesión existente
      return session
    } else {
      const isAdmin = getConfig().adminPhoneList.includes(phone)
      let session: TSession

      if (isAdmin) {
        // Nueva sesión para usuario ADMIN
        const [nroCedula, nroAfiliado, nroCelular] = getConfig().loginData.split(' ')

        const loginData = await new AndeService().login({
          nroCedula,
          nroAfiliado,
          nroCelular
        })

        // Se crea una sesión especial para usuario ADMIN
        session = {
          phone,
          treeLevel: 'HOME',
          treeStep: '',
          ande: {
            affiliate: loginData!.afiliado,
            token: loginData!.token
          },
          store: {} as any
        }
      } else {
        // Se crear una sesión general
        session = {
          phone,
          treeLevel: 'MAIN',
          treeStep: '',
          ande: null,
          store: {} as any
        }
      }

      // Agregar nueva sesión
      SessionService.sessions.push(session)
      return session
    }
  }

  public static update(sessionUpdated: TSession): void {
    const phone = sessionUpdated.phone
    const session = SessionService.getSession(phone)

    if (session) {
      let sessionsDebug: Partial<TSession>[] = []

      SessionService.sessions.forEach(session => {
        if (session.phone === phone) {
          session = sessionUpdated
        }

        sessionsDebug.push({
          phone: session.phone,
          treeLevel: session.treeLevel,
          treeStep: session.treeStep
        })
      })

      botDebug('SESSIONS', 'updated', sessionsDebug)
      console.log()
    }
  }

  private startDatabase(): void {
    // TODO: Por ahora se usa una variable estatica para almacenar las sesiones.
    // Pero en el futuro esto debe ser almacenado en una DB local (json o sqlite) o remota (mongo, postgress)
    SessionService.sessions = []
  }

  private static getSession(phone: string): TSession | null {
    const session = SessionService.sessions.find(session => session.phone === phone)
    return session || null
  }
}
