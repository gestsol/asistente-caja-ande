import { loadConfig } from '~UTILS/config.util'
import { ServerService } from './services/Server.service'

async function main() {
  try {
    await loadConfig()
    const server = new ServerService()

    // Iniciar variable super global
    global.SESSIONS = []

    server.start()
  } catch (error) {
    console.error((error as Error).message)
  }
}

main()
