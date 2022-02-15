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
  timerSessionMin: number
  messageSession: boolean
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
  menuHome: string
}

type TEnv = 'development' | 'production'

type TSession = {
  phone: ExecOptionsWithStringEncoding
  affiliate: TAffiliate | null
  treeLevel: TLevel
  treeStep: TStep
}

type TLevel =
  | 'MAIN'
  | 'MESA'
  | 'LOGIN'
  | 'HOME'
  | 'CREDIT_CARD'
  | 'LENDING_QUERY'
  | 'NEWS'
  | 'PERSONAL_DATA'
  | 'DOWNLOAD'
  | 'LINKS'
  | 'ENTRY_TABLE'
  | 'LENDINGS'

type TStep = '' | 'STEP_1' | 'STEP_2' | 'STEP_3'

type TWassiData = TWassiBody['data']

// DECLARATIONS ________________________________________________________________________________________________________

// Base de datos temporal
declare var SESSIONS: TSession[]
declare var AFFILIATE: TAffiliate | null
declare var TREE_LEVEL: TLevel
declare var TREE_STEP: TStep
