import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { getDatePrevious, getDateFromPeriod, getPeriodFromMessage } from '~UTILS/date.util'
import { messageOptionInvalid } from '~UTILS/message.util'
import { MENU_HOME } from '~ENTITIES/consts'

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
              const { type, docList } = STORE.download
              const months12 = 31_557_600_000 // 12 meses en milisegundos
              const months12Time = getDatePrevious(months12).getTime()

              // Se filtra los documentos con fechas de los ultimos 12 meses
              const docLastMonth12 = docList.filter(
                ({ periodo }) => getDateFromPeriod(periodo).getTime() >= months12Time
              )

              // Se ejcutan todas las peticiones en paralelo haciendo uso de "Promise.allSettled"
              const fileList = await Promise.allSettled(
                docLastMonth12.map(async ({ periodo, nroFactura }) => {
                  return this.andeService.getDoc(type, {
                    periodo,
                    nroFactura
                  })
                })
              )

              for await (const file of fileList) {
                // Todas las promesas seran resueltas incluso si hay error
                // debido a que el servicio "Ande.service" captura cualquier error
                if (file.status === 'fulfilled') {
                  if (typeof file.value === 'object') {
                    const { filename, pdf } = file.value
                    await this.sendFile(filename, pdf)
                  } else {
                    await this.sendMessage(`
                    ${file.value}

                    ${MENU_HOME}
                    `)
                  }
                }

                response = 'OK'
              }
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
                  await this.sendFile(file.filename, file.pdf)
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
      (    ) Ingrese mes y año, ejemplo: *02-2010*
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
