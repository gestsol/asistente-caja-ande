type TConfig = {
  port: number
  debug: boolean
}

type TEnv = 'development' | 'production'

// DECLARATIONS ________________________________________________________________________________________________________

declare var config: TConfig
