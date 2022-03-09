import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { getPeriodFromMessage } from '~UTILS/date.util'
import { messageOptionInvalid } from '~UTILS/message.util'
import { MENU_HOME } from '~ENTITIES/consts'
import { getConfig } from '~UTILS/config.util'

export class DownloadController extends Controller {
  async startDecisionTree() {
    let response = ''

    const options = `
    (161) Facturas
    (162) Exatractos de préstamos
    (163) Liquidación mensual de haberes`

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'DOWNLOAD'
        TREE_STEP = ''
        this.initStore()

        response = `
        Elige una de las siguientes opciones:
        ${options}
        ${MENU_HOME}
        `
        break

      case '161':
        response = await this.getDocListByType(
          'factura',
          `
          Revisa tus facturas 📊
          ¿Qué querés revisar?`
        )
        break

      case '162':
        response = await this.getDocListByType(
          'extracto',
          `
          Revisa tus préstamos 📊
          ¿Qué querés revisar?`
        )
        break

      case '163':
        response = await this.getDocListByType(
          'liquidacionhaber',
          `
          Revisa tus haberes 📊
          ¿Qué querés revisar?`
        )
        break

      case '0':
        TREE_LEVEL = 'HOME'
        this.initStore()

        new HomeController({
          ...this.data,
          message: 'menu'
        })
        break

      default:
        switch (TREE_STEP) {
          case 'STEP_1':
            // Obtener documentos de los ultimos 12 meses
            if (this.message === '12') {
              if (getConfig().modeAPP === 'BOT') {
                await this.sendMessage('⏳ Espere un momento por favor mientras se buscan los archivos')
              }

              const { type, docList } = STORE.download

              // Se filtran los documentos por los 12 últimos
              const docLast12 = docList.filter((_, i) => i < 12)

              // Se ejcutan todas las peticiones en paralelo haciendo uso de "Promise.allSettled"
              const fileListSettledResult = await Promise.allSettled(
                docLast12.map(async ({ periodo, nroFactura }) => {
                  return this.andeService.getDoc(type, {
                    periodo,
                    nroFactura
                  })
                })
              )

              // Se preparan los archivos obtenidos transformando los datos de tipo "SettledResult" a "TFile"
              const fileList: TFile[] = fileListSettledResult.map(file => {
                // Todas las promesas seran resueltas incluso si hay error
                // debido a que el servicio "Ande.service" captura cualquier error
                if (file.status === 'fulfilled') {
                  return typeof file.value === 'object'
                    ? { filename: file.value.filename, stream: file.value.pdf }
                    : file.value
                } else return {} as TFile
              })

              await this.sendFiles(fileList)
              response = 'OK'
              break
            }

            const periodo = getPeriodFromMessage(this.message)

            // Obtener documento del periodo ingresado
            if (periodo) {
              const { type, docList } = STORE.download
              const doc = docList.find(doc => doc.periodo === periodo)

              if (doc) {
                const file = await this.andeService.getDoc(type, {
                  periodo,
                  nroFactura: doc?.nroFactura
                })

                if (typeof file === 'object') {
                  await this.sendFiles([
                    {
                      filename: file.filename,
                      stream: file.pdf
                    }
                  ])
                  response = 'OK'
                } else {
                  response = `
                  ${file}

                  ${MENU_HOME}
                  `
                }
              } else {
                response = `
                No existe una factura del periodo ingresado, intente con otro mes y año

                ${MENU_HOME}
                `
              }
              break
            } else {
              response = `
              El formato de mes y año son invalidos, intente de nuevo

              ${MENU_HOME}
              `
            }
            break

          default:
            response = messageOptionInvalid(options)
            break
        }
    }

    return this.sendMessage(response)
  }

  private async getDocListByType(type: TDocType, responseTitle: string): Promise<string> {
    const docs = await this.andeService.getDocList(type)

    if (typeof docs === 'object') {
      TREE_STEP = 'STEP_1'
      STORE.download.docList = docs

      return `
      ${responseTitle}

      (12) Los últimos *12 meses*
      () Ingrese mes y año, ejemplo: *02-2010*
      `
    } else {
      return `
      ${docs}

      ${MENU_HOME}
      `
    }
  }

  private initStore(): void {
    STORE = { download: { body: {} } } as any
  }
}
