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

    const subOptions = `
    (12) Los últimos *12 meses*
    (    ) Ingrese mes y año, ejemplo: *02-2010*`

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
        TREE_STEP = 'STEP_1'
        const invoiceList = await this.andeService.getDocsList('factura')

        if (typeof invoiceList === 'object') {
          STORE.download.type = 'factura'
          STORE.download.docList = invoiceList

          response = `
          Revisa tus facturas 📊
          ¿Qué querés revisar?

          ${subOptions}
          `
        }
        response = `
        Revisa tus facturas 📊
        ¿Qué querés revisar?

        ${subOptions}
        `
        break

      case '162':
        response = `
        EN DESARROLLO

        ${MENU_HOME}
        `
        // response = `
        // Revisa tus préstamos 📊
        // ¿Qué querés revisar?

        // ${subOptions}
        // `
        break

      case '163':
        response = `
        EN DESARROLLO

        ${MENU_HOME}
        `
        // response = `
        // Revisa tus haberes 📊
        // ¿Qué querés revisar?

        // ${subOptions}
        // `
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
              const docs = docList.filter(({ periodo }) => getDateFromPeriod(periodo).getTime() >= months12Time)

              // Se ejcutan todas las peticiones en paralelo haciendo uso de "Promise.allSettled"
              const pdfList = await Promise.allSettled(
                docs.map(async ({ periodo, nroDocumento }) => {
                  return this.andeService.downloadDoc(type, {
                    periodo,
                    nroDocumento
                  })
                })
              )

              // Preparar una lista de respuestas
              const responseList: string[] = []

              pdfList.forEach(doc => {
                // Todas las promesas seran resueltas incluso si hay error
                // debido a que el servicio "Ande.service" captura cualquier error
                if (doc.status === 'fulfilled') {
                  if (typeof doc.value === 'object') {
                    responseList.push(doc.value.pdf.substring(0, 40) + '...')
                  } else responseList.push(doc.value)
                }
              })

              // TODO: Iterarlo la lista de respuestas en el metodo sendMessage,
              // para esto habrá que refactoriza la clase Controller
              console.log('LISTA DE DOCUMENTOS PDF:')
              console.log(responseList)

              response = `
              EN DESARROLLO

              ${MENU_HOME}
              `
              break
            }

            // Obtener documento del periodo ingresado
            if (this.message) {
              const periodo = getPeriodFromMessage(this.message)
              const { type, docList } = STORE.download

              if (periodo) {
                const doc = docList.find(doc => doc.periodo === periodo)

                if (doc) {
                  const filePDF = await this.andeService.downloadDoc(type, {
                    periodo,
                    nroDocumento: doc.nroDocumento
                  })

                  console.log('DOCUMENTO PDF:')
                  console.log((filePDF as string).substring(0, 40) + '...')

                  response = `
                  EN DESARROLLO

                  ${MENU_HOME}
                  `
                } else {
                  response = `
                  No existe una factura del periodo ingresado, intente con otro mes y año

                  ${MENU_HOME}
                  `
                }
              } else {
                response = `
                El formato de mes y año son invalidos, intente de nuevo

                ${MENU_HOME}
                `
              }
              break
            }

            response = messageOptionInvalid()
            break

          default:
            response = messageOptionInvalid(options)
            break
        }
    }

    this.sendMessage(response)
  }

  private initStore(): void {
    STORE = { download: { body: {} } } as any
  }
}
