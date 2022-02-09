import { loadConfig } from '~UTILS/config.util'
import { ServerService } from './services/Server.service'

async function main() {
  try {
    await loadConfig()
    const server = new ServerService()

    // Iniciar variables super globales
    global.FLOW_STATE = 'MAIN_1'
    global.FLOW_STATE_STEP = ''

    server.start()
  } catch (error) {
    console.error((error as Error).message)
  }
}

main()
