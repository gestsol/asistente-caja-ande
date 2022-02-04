import { Router, Request, Response } from 'express'
import { HomeController } from '~CONTROLLERS'

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

router.post(
  '/',
  async (req: Request, res: Response): Promise<void> => {
    // const {
    //   fromNumber,
    //   chat: {
    //     contact: { displayName }
    //   }
    // } = req.body.data

    // switch (options) {
    //   case 1:
    //     controllerCreditCard()
    //     break

    //   case 2:
    //     controller2()
    //     break

    //   case 3:
    //     controller3()
    //     break

    //   default:
    //     controllerDefault()
    //     break
    // }

    const homeController = new HomeController()
    homeController.startDecisionTree(req.body.data)

    res.end()
  }
)

export { router as wassiRoutes }
