import { Controller } from '~CLASS/Controller'
import { HomeController } from '~CONTROLLERS/Home.controller'
import { MENU_HOME } from '~ENTITIES/consts'
import { messageOptionInvalid } from '~UTILS/message.util'

export class PersonalDataController extends Controller {
  async startDecisionTree() {
    let response = ''

    const options = `
    (151) Cargar una foto (Reconocimiento facial)
    (152) Cargar domicilio (Envío de ubicación)`

    switch (this.message) {
      case 'menu':
        TREE_LEVEL = 'PERSONAL_DATA'
        TREE_STEP = ''

        response = `
        Elige una de las siguiente opciones:
        ${options}
        ${MENU_HOME}
        `
        break

      case '151':
        TREE_STEP = 'STEP_1'
        response = `
        Para comenzar con el reconocimiento facial tienes que cargar una foto.
        Debe ser una foto de color claro y no utilizar lentes de sol ni mascarillas 😬
        `
        break

      case '152':
        TREE_STEP = 'STEP_2'
        response = `
        Necesitamos saber tu domicilio, por favor envia tu dirección usando la función de *enviar ubicación de Whatsapp* 🗺️
        No olvides ubicar correctamente tu casa 🏡
        `
        break

      case '0':
        TREE_LEVEL = 'HOME'
        new HomeController({
          ...this.data,
          message: 'menu'
        })
        break

      default:
        switch (TREE_STEP) {
          case 'STEP_1':
            const isImage = this.data.dataType === 'image'

            // Validación basica de la imagen que se quiere subir
            if (isImage && this.data.file) {
              const image = await this.downloadFile(this.data.file.id)

              if (image) {
                const photo = await this.andeService.uploadPhoto(image)

                if (typeof photo === 'object' && photo.uploaded) {
                  response = `
                  ✅ Su fotografía ha sido guardada correctamente

                  ${MENU_HOME}
                  `
                } else {
                  response = `
                  ${photo}

                  ${MENU_HOME}
                  `
                }
              } else {
                response = `
                ⚠️ Error al obtener la imagen, intente de nuevo

                ${MENU_HOME}
                `
              }
            } else response = 'El archivo enviado es incorrecto, por favor revisa que sea una imagen correcta'

            break

          case 'STEP_2':
            const isLocation = this.data.dataType === 'location'

            if (isLocation && this.data.location) {
              const { latitude, longitude } = this.data.location

              const location = await this.andeService.saveLocation({
                ubicacionLatitud: latitude.toString(),
                ubicacionLongitud: longitude.toString()
              })

              if (typeof location === 'object' && location.saved) {
                response = `
                ✅ Su ubicación ha sido guardada correctamente

                ${MENU_HOME}
                `
              } else {
                response = `
                ${location}

                ${MENU_HOME}
                `
              }
            } else response = 'El archivo enviado es incorrecto, por favor revisa que sea una imagen correcta'
            break

          default:
            response = messageOptionInvalid(options)
            break
        }
        break
    }

    return this.sendMessage(response)
  }
}
