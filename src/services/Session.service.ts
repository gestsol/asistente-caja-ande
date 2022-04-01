import { botDebug } from '~UTILS/debug.util'
import { getConfig } from '~UTILS/config.util'
import { AndeService } from '~SERVICES/Ande.service'
import { WassiService } from '~SERVICES/Wassi.service'

export class SessionService {
  public static sessions: TSession[] = []

  constructor() {
    this.startDatabase()
  }

  public async login({ phone, name }: { phone: string; name: string }): Promise<TSession> {
    const session = SessionService.getSession(phone)

    if (session) {
      const timeNow = new Date().getTime()
      const timeLastReq = session.dateLastReq.getTime()
      const timeLimitSession = getConfig().minutesSession * 60 * 1000

      // Si el tiempo actual ha superado el limite de sesión establecido entonces se elimina la sesión actual
      if (timeNow - timeLastReq >= timeLimitSession) {
        SessionService.sessions = SessionService.sessions.filter(session => session.phone !== phone)
      } else return session
    }

    return await this.create(phone, name)
  }

  private async create(phone: string, name: string): Promise<TSession> {
    const isAdmin = getConfig().adminPhoneList.includes(phone)
    let session: TSession

    if (isAdmin) {
      // Nueva sesión para usuario ADMIN
      const loginResponse = await new AndeService().loginAdmin()

      if (typeof loginResponse === 'object') {
        // Se crea una sesión especial para usuario ADMIN
        session = {
          phone,
          name,
          treeLevel: 'HOME',
          treeStep: '',
          ande: {
            affiliate: loginResponse.afiliado,
            token: loginResponse.token
          },
          store: {} as any,
          dateLastReq: {} as Date
        }
      } else {
        if (getConfig().modeAPP === 'BOT') {
          await new WassiService().sendMessage({
            phone,
            message: loginResponse
          })
        }

        throw {
          name: 'Session',
          message: 'Caja Ande service does not respond'
        }
      }
    } else {
      // Se crear una sesión general
      session = {
        phone,
        name,
        treeLevel: 'MAIN',
        treeStep: '',
        ande: null,
        store: {} as any,
        dateLastReq: {} as Date
      }
    }

    // Agregar nueva sesión
    SessionService.sessions.push(session)
    return session
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
          name: session.name,
          treeLevel: session.treeLevel,
          treeStep: session.treeStep,
          dateLastReq: session.dateLastReq
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
