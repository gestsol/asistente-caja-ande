import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { convertMessageInFullname, convertPhoneInLocal } from '~UTILS/message.util'
import { MENU_HOME } from '~ENTITIES/consts'

export class EntryTable extends Controller {
  async startDecisionTree() {
    let response = ''

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'ENTRY_TABLE'
        TREE_STEP = 'STEP_1'

        this.initStore()

        response = `
        En mesa de entrada podras guardar los archivos que desee

        Ingrese una descripción para el archivo
        `
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
            TREE_STEP = 'STEP_2'
            STORE.entryTable.description = this.message
            response = 'Ingrese una observación'
            break

          case 'STEP_2':
            TREE_STEP = 'STEP_3'
            STORE.entryTable.observation = this.message
            response = 'Ingrese el archivo que desea guardar'
            break

          case 'STEP_3':
            const { description, observation } = STORE.entryTable

            if (this.data.file?.id) {
              const fileWassi = await this.downloadFile(this.data.file?.id)

              if (fileWassi) {
                const { nombre, nroCedula, email } = ANDE!.affiliate
                const [name, lastname] = convertMessageInFullname(nombre).split(' ')

                const file = await this.andeService.uploadFile({
                  nombre: name,
                  apellido: lastname,
                  celular: convertPhoneInLocal(this.data.phone),
                  nroCedula: nroCedula.toString(),
                  email: email || '',
                  descripcion: description,
                  observacion: observation,
                  archivo: fileWassi
                })

                if (typeof file === 'object' && file.uploaded) {
                  response = `
                  ✅ Su archivo ha sido guardado correctamente

                  ${MENU_HOME}
                  `
                } else {
                  response = `
                  ${file}

                  ${MENU_HOME}
                  `
                }
              } else {
                response = `
                ⚠️ Error al obtener el documento, intente de nuevo

                ${MENU_HOME}
                `
              }

              break
            } else response = 'El archivo enviado es incorrecto, por favor revisa que el documento sea correcto'

            break
        }

        break
    }

    return this.sendMessage(response)
  }

  private initStore(): void {
    STORE = { entryTable: {} } as any
  }
}
