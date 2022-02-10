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
  modeAPP: 'API' | 'BOT'
}

type TConfigHttpClient = {
  baseURL: string
  defaultPath: string
  token?: string
}

type TDataController = {
  phone: string
  message: string
  res: import('express').Response
}

type TEnv = 'development' | 'production'

type TSession = {
  phone: ExecOptionsWithStringEncoding
  affiliate: TAffiliate | null
  treeLevel: TLevel
  treeStep: TStep
}

type TLevel = 'MAIN' | 'MESA' | 'LOGIN' | 'HOME' | 'CREDIT_CARD' | 'LENDING_QUERY' | 'NEWS' | 'PERSONAL_DATA'
type TStep = '' | 'STEP_1' | 'STEP_2' | 'STEP_3'

// DECLARATIONS ________________________________________________________________________________________________________

declare var config: TConfig

declare var SESSIONS: TSession[]
declare var AFFILIATE: TAffiliate | null
declare var TREE_LEVEL: TLevel
declare var TREE_STEP: TStep
