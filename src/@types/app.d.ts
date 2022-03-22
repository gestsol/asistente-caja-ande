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
  supportPhone: string
  loginData: string
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
    filename: string
  } | null
  location: TWassiRequest['data']['location'] | null
  res: import('express').Response
  session: TSession
}

type TEnv = 'development' | 'production'

type TSession = {
  phone: string
  name: string
  treeLevel: TLevel
  treeStep: TStep
  ande: TAnde | null
  store: TStore
}

type TAnde = {
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
    fee: number
    deadline: TDeadline
    payMethodList: TAndeResponse['formacobro']
    bankAccountList: TAndeResponse['cuentas']
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
    ci: string
    name: string
    lastname: string
    email: string
    description: string
    observation: string
    filename: string
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

type TStep = '' | 'STEP_1' | 'STEP_2' | 'STEP_3' | 'STEP_4' | 'STEP_5' | 'STEP_6' | 'STEP_7' | 'STEP_8'

type TTypeLending = 'paralelo' | 'cancelacion' | 'estudiantil' | 'extraordinario'

type TDocType = 'factura' | 'extracto' | 'liquidacionhaber'

type TDataStream = import('http').IncomingMessage
