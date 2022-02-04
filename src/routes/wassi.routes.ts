import { Router, Request, Response, NextFunction } from 'express'
// import { WassiService } from '../services/Wassi.service'

const router = Router()

/*
if ((strpos(strtolower($body->data->body), "hola") !== false) || (strpos(strtolower($body->data->body), "dia") !== false) || (strpos(strtolower($body->data->body), "tarde") !== false) || (strpos(strtolower($body->data->body), "noche") !== false)) {
    $message = "Hola 🤗 ".$name.", soy el Asistente Virtual de Caja Ande 🤓".
        "\\n*Nuestra Caja, tu futuro!*".
        "\\n Selecciona una opción para poder ayudarte:" .
        "\\n*1.* Jubilados y pensionados" .
        "\\n*2.* Proveedores".
        "\\n*99.* Obtener Motivos Créditos (API TEST)";
    send_message($body->data->fromNumber, $message);
}
*/

router.post('/', (req: Request, res: Response, next: NextFunction): void => {
  const {
    chat: {
      contact: { displayName }
    }
  } = req.body.data

  console.log(displayName)

  res.json(displayName)

  //   const wassi = new WassiService()

  //   const message = `Hola 🤗 ".$name.", soy el Asistente Virtual de Caja Ande 🤓".
  //         "\\n*Nuestra Caja, tu futuro!*".
  //         "\\n Selecciona una opción para poder ayudarte:" .
  //         "\\n*1.* Jubilados y pensionados" .
  //         "\\n*2.* Proveedores".
  //         "\\n*99.* Obtener Motivos Créditos (API TEST)";
  // `

  // wassi.sendMessage('', message)
})

export { router as wassiRoutes }
