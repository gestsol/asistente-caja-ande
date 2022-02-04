export async function loadConfig(): Promise<void> {
  const { resolve } = await import('path')
  const { config } = await import('dotenv')

  const NODE_ENV = process.env.NODE_ENV as TEnv
  const result = config({ path: resolve('env', `${NODE_ENV}.env`) })

  if (result.error) throw new Error(`ERROR-ENV: ${result.error.message}`)
  else console.log(`ENV: environment "${NODE_ENV}" loaded successfully`)

  const ENV: NodeJS.ProcessEnv = process.env

  const _config: TConfig = {
    port: Number(ENV.PORT) || 3000,
    debug: ((ENV.DEBUG as unknown) as boolean) || false
  }

  global.config = _config
}
