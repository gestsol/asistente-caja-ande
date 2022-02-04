type TConfig = {
  port: number
  debug: boolean
  wassi: {
    apiUrl: string
    token: string
    device: string
  }
  ande: {
    apiUrl: string
  }
}

type TEnv = 'development' | 'production'

// DECLARATIONS ________________________________________________________________________________________________________

declare var config: TConfig
