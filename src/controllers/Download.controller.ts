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
        STORE.download.type = 'prestamo'

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
              const docLastMonth12 = docList.filter(
                ({ periodo }) => getDateFromPeriod(periodo).getTime() >= months12Time
              )

              // Se ejcutan todas las peticiones en paralelo haciendo uso de "Promise.allSettled"
              const fileList = await Promise.allSettled(
                docLastMonth12.map(async ({ periodo, nroDocumento }) => {
                  return this.andeService.downloadDoc(type, {
                    periodo,
                    nroDocumento
                  })
                })
              )

              // Preparar una lista de respuestas
              const responseList: string[] = []

              fileList.forEach(file => {
                // Todas las promesas seran resueltas incluso si hay error
                // debido a que el servicio "Ande.service" captura cualquier error
                if (file.status === 'fulfilled') {
                  if (typeof file.value === 'object') {
                    responseList.push(file.value.pdf.substring(0, 40) + '...')
                  } else responseList.push(file.value)
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

            const periodo = getPeriodFromMessage(this.message)

            // Obtener documento del periodo ingresado
            if (periodo) {
              const { type, docList } = STORE.download
              const { codPersonalAnde } = ANDE!.affiliate

              const doc = docList.find(doc => doc.periodo === periodo)

              if (doc) {
                const file = await this.andeService.downloadDoc(type, {
                  periodo,
                  nroDocumento: doc.nroDocumento
                })

                if (typeof file === 'object') {
                  const filename = `${type}-${codPersonalAnde}-${doc.nroDocumento}`

                  // FIXME: Los documentos se envian en blanco
                  await this.sendFile(filename, file.pdf)
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

    this.sendMessage(response)
  }

  private initStore(): void {
    STORE = { download: { body: {} } } as any
  }
}
