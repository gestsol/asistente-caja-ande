import { loadConfig } from '~UTILS/config.util'
import { ServerService } from './services/Server.service'

async function main() {
  try {
    await loadConfig()
    const server = new ServerService()
    global.FLOW_STATE = ''

    server.start()
  } catch (error) {
    console.error((error as Error).message)
  }
}

main()
