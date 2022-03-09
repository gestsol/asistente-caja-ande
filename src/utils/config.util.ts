export async function loadConfig(): Promise<void> {
  const { resolve } = await import('path')
  const { config } = await import('dotenv')

  const NODE_ENV = process.env.NODE_ENV as TEnv
  const result = config({ path: resolve('env', `${NODE_ENV}.env`) })

  if (result.error) throw new Error(`ERROR-ENV: ${result.error.message}`)
  else console.log(`ENV: environment "${NODE_ENV}" loaded successfully`)
}

export const getConfig = (): TConfig => {
  const ENV: NodeJS.ProcessEnv = process.env

  return {
    port: Number(ENV.PORT) || 3000,
    debug: ENV.DEBUG === 'true' ? true : false,
    wassi: {
      apiUrl: (ENV.WASSI_API_URL as string) || '',
      token: (ENV.WASSI_TOKEN as string) || '',
      device: (ENV.WASSI_DEVICE as string) || ''
    },
    ande: {
      apiUrl: (ENV.ANDE_API_URL as string) || ''
    },
    modeAPP: (ENV.MODE_APP as any) || 'BOT',
    messageSession: ENV.MESSAGE_SESSION === 'true' ? true : false,
    adminPhomeList: (ENV.ADMIN_PHONE_LIST as string)?.split(',') || [],
    affiliate: {
      nroCedula: (ENV.AFFILIATE_NRO_CEDULA as string) || '',
      nroAfiliado: (ENV.AFFILIATE_NRO as string) || '',
      nroCelular: (ENV.AFFILIATE_NRO_CELULAR as string) || ''
    }
  }
}
