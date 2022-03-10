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
  adminPhoneList: Array<string>
  affiliate: {
    nroCedula: string
    nroAfiliado: string
    nroCelular: string
  }
}

type TConfigHttpClient = {
  baseURL: string
  defaultPath: string
  timeoutSecond?: number
  headers?: import('axios').AxiosRequestHeaders
}

type TDataController = {
  message: string
  dataType: TWassiRequest['data']['type']
  file: {
    id: string
    size: number
    mime: string
    extension: string
  } | null
  location: TWassiRequest['data']['location'] | null
  res: import('express').Response
  menuHome: string
  session: TSession
}

type TEnv = 'development' | 'production'

type TSession = {
  phone: string
  treeLevel: TLevel
  treeStep: TStep
  ande: TAnde
  store: TStore
}

type TAnde = null | {
  affiliate: TAffiliate
  token: string
}

type TStore = {
  login: {
    ci: string
  }
  lending: {
    type: TTypeLending
    deadlineList: TDeadline[]
    deadline: TDeadline
    payMethodList: TAndeResponse['formacobro']
    amount: number
  }
  creditCard: {
    tcList: TAndeResponse['datosstc']
    creditLine: TAndeResponse['lineacreditotc']
    familyTypeList?: TAndeResponse['tipofamiliatc']
    familyType?: TAndeResponse['tipofamiliatc'][0]
    amount: number
    fullName: string
    ci: number
    phone: string
    address: string
  }
  download: {
    type: TDocType
    docList: TDocList
  }
  entryTable: {
    description: string
    observation: string
  }
}

type TDocList = TAndeResponse['facturaCabecera'] &
  TAndeResponse['extractoCabecera'] &
  TAndeResponse['liquidacionhaberCabecera']

type TFile =
  | {
      filename: string
      stream: TDataStream
    }
  | string

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

type TStep = '' | 'STEP_1' | 'STEP_2' | 'STEP_3' | 'STEP_4' | 'STEP_5' | 'STEP_6'

type TTypeLending = 'paralelo' | 'cancelacion' | 'estudiantil' | 'extraordinario'

type TDocType = 'factura' | 'extracto' | 'liquidacionhaber'

type TDataStream = import('http').IncomingMessage
