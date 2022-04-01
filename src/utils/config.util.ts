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
    adminPhoneList: (ENV.ADMIN_PHONE_LIST as string)?.split(',') || [],
    supportPhone: (ENV.SUPPORT_PHONE as string) || '',
    loginData: (ENV.LOGIN_DATA as string) || '',
    // Por defecto el tiempo es de 25 min porque la api de "Caja Ande" caduca el token en 30 min
    minutesSession: Number(ENV.MINUTES_SESSION) || 25
  }
}
