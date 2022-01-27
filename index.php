<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

require('lib/message.php');
require ('lib/cajaande.php');
//require('lib/spreadsheets.php');
//require('lib/covid.php');
//require('lib/nearest.php');

$body = file_get_contents('php://input');
$body = json_decode($body);

$verifications = 0;
$name = "";
$phone = "";
$company_id = "";


$message = "";
$satisfaccion = "Muchas gracias por contactarnos, te invitamos a completar la siguiente encuesta de satisfacción.\\n\\nhttps://forms.gle/Jc9brAwL5vzceQke8";
$ejecutivo = "En breve un agente se comunicara con usted🙋";
$preferencia = "Muchas gracias por su preferencia";
$name = $body->data->chat->contact->displayName != "" ? " ".$body->data->chat->contact->displayName : "";
if ((strpos(strtolower($body->data->body), "hola") !== false) || (strpos(strtolower($body->data->body), "dia") !== false) || (strpos(strtolower($body->data->body), "tarde") !== false) || (strpos(strtolower($body->data->body), "noche") !== false)) {
    $message = "Hola 🤗 ".$name.", soy el Asistente Virtual de Caja Ande 🤓".
        "\\n*Nuestra Caja, tu futuro!*".
        "\\n Selecciona una opción para poder ayudarte:" .
        "\\n*1.* Jubilados y pensionados" .
        "\\n*2.* Proveedores".
        "\\n*99.* Obtener Motivos Créditos (API TEST)";
    send_message($body->data->fromNumber, $message);
}
// 1
else if (strtolower($body->data->body) == 1) {
    $message = "Jubilados y pensionados Caja Ande".
        "\\nPor favor envíanos tu CI para ayudarte".
        "\\n";
    send_message($body->data->fromNumber, $message);
    $message = "En Caja Ande trabajamos para ti 🤓, revisa las opciones que tenemos disponible:".
        "\\n*11.* Préstamos 💰".
        "\\n*12.* Tarjetas de crédito 💳".
        "\\n*13.* Consultar crédito vigente 🧐".
        "\\n*14.* Noticias e informaciones del mes 📱".
        "\\n*15.* CENSO".
        "\\n*16.* Solicitudes 🤗";
    send_message_timeout($body->data->fromNumber, $message, 10);
}

else if (strtolower($body->data->body) == 99) {
    $response = get_motivo_credito();
    if ($response != null) {
        $message = 'Response API TEST: \\n';
        foreach ($response as $obj) {
            $message.= "[".$obj->codigo. "] " .$obj->descripcion . "\\n";
        }
        send_message($body->data->fromNumber, $message);
    }

}


else if (strtolower($body->data->body) == 11) {
//11
    $message = "Calcula y solicita tu préstamo!".
        "\\n*111.* Préstamos especiales ✨".
        "\\n*112.* Préstamos en promoción 💰".
        "\\n*113.* Préstamos escolares 📚".
        "\\n*114.* Préstamos extraordinarios 💥".
        "\\n*115.* Préstamos hipotecarios 🏠".
        "\\n";
    send_message($body->data->fromNumber, $message);
}


else if (strtolower($body->data->body) == 111) {
    //111
    $message = "~Respuesta en caso de tener crédito pre-aprobado (Falta Integración API)~".
        "\\nPréstamos especiales ✨".
        "\\n".$name." felicidades 🎉 ".
        "\\nTienes un crédito Pre - Aprobado.".
        "\\n*3.* Más info del crédito pre aprobado";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 112) {
    //112
    $message = "~Respuesta en caso de tener crédito pre-aprobado (Falta Integración API)~".
        "\\nPréstamos en promoción 💰".
        "\\n".$name." felicidades 🎉 ".
        "\\nTienes un crédito Pre - Aprobado.".
        "\\n*3.* Más info del crédito pre aprobado";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 113) {
    //113
    $message = "~Respuesta en caso de tener crédito pre-aprobado (Falta Integración API)~".
        "\\nPréstamos escolares 📚".
        "\\n".$name." felicidades 🎉 ".
        "\\nTienes un crédito Pre - Aprobado.".
        "\\n*3.* Más info del crédito pre aprobado";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 114) {
    //114
    $message = "~Respuesta en caso de tener crédito pre-aprobado (Falta Integración API)~".
        "\\nPréstamos extraordinarios 💥".
        "\\n".$name." felicidades 🎉 ".
        "\\nTienes un crédito Pre - Aprobado.".
        "\\n*3.* Más info del crédito pre aprobado";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 115) {
    //115
    $message = "~Respuesta en caso de tener crédito pre-aprobado (Falta Integración API)~".
        "\\nPréstamos hipotecarios 🏠".
        "\\n".$name." felicidades 🎉 ".
        "\\nTienes un crédito Pre - Aprobado.".
        "\\n*3.* Más info del crédito pre aprobado";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 12) {
//12
    $message = "Tarjetas de crédito 💳".
            "\\n*121.* Solicitar tarjeta".
            "\\n*122.* Pago mínimo".
            "\\n*123.* Fecha de vencimiento".
            "\\n*124.* Solicitar tarjeta paralela".
            "\\n";
    send_message($body->data->fromNumber, $message);}


else if (strtolower($body->data->body) == 13) {
//13
    $message = "Consultar crédito vigente 🧐".
            "\\n*131.* Monto a pagar y fecha de vencimiento".
            "\\n*132.* Extracto de cuenta".
             "\\n";
    send_message($body->data->fromNumber, $message);
}


else if (strtolower($body->data->body) == 14) {
//14
    $message = "Noticias e informaciones del mes 📱".
            "\\n*141.* Fechas de cobro".
            "\\n*142.* Promociones".
             "\\n";
    send_message($body->data->fromNumber, $message);
}


else if (strtolower($body->data->body) == 15) {
//15
    $message = "CENSO".
            "\\n*151.* Cargar una foto (Reconocimiento facial)".
            "\\n*152.* Cargar domicilio (envío de ubicación)".
             "\\n";
    send_message($body->data->fromNumber, $message);
}


else if (strtolower($body->data->body) == 16) {
//16
    $message = "Solicitudes 🤗".
            "\\n*161.* Solicitar facturas (últimos 12 meses)".
            "\\n*162.* Consultar haberes Interactivo (Jubilados y pensionados)".
             "\\n";
    send_message($body->data->fromNumber, $message);
}


else if (strtolower($body->data->body) == 2) {
//2
    $message = "Mesa de entrada para Proveedores" .
        "\\nEnvíenos su nombre completo, CI Y número de teléfono" .
        "\\n Pronto una operadora se pondrá en contacto con usted" .
        "\\n";
    send_message($body->data->fromNumber, $message);
}
else if (strtolower($body->data->body) == 2) {
//
    $message = "";
    send_message($body->data->fromNumber, $message);
}
else if (strtolower($body->data->body) == 121) {
    // 121
    $message = "Solicitar tarjeta ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 122) {
    // 122
    $message = "Revisa aquí tu pago mínimo ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 123) {
    // 123
    $message = "Revisa aquí la fecha de vencimiento de tu tarjeta de crédito ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 124) {
    // 124
    $message = "Solicita una tarjeta paralela aquí 🤓 ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 131) {
    // 131
    $message = "Revisa aquí el monto a pagar y su fecha de vencimiento 🙀 ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 132) {
    // 132
    $message = "Revisar el extracto de tu cuenta nunca fue tan fácil 😎 ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 141) {
    // 141
    $message = "No te olvides de tus fechas de cobro! 😇  ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 142) {
    // 142
    $message = "Las mejores promociones en un solo lugar 😌 ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 151) {
    // 151
    $message = "Para comenzar con el reconocimiento facial debes cargar una foto 📷 . Recuerda, debe tener un fondo de color claro y no utilizar lentes de sol ni mascarilla 😬  ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 152) {
    // 152
    $message = "Necesitamos saber tu domicilio, por favor envíanos tu dirección en un único mensaje, no olvides incluir el nombre de la calle y su numeración 📍 ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 161) {
    // 161
    $message = "Revisa tus facturas de los últimos 12 meses 📊  ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 162) {
    // 162
    $message = "Consulta tus haberes aquí 📌 ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}

else if (strtolower($body->data->body) == 3) {
    // 3
    $message = "Más info del crédito pre aprobado ~(Falta Integración API)~";
    send_message($body->data->fromNumber, $message);
}
else if ($body->data->type == "image") {
    // image
    $message = "Su imagen 📷 será analizada por nuestro sistema de Reconocimiento Facial ✅";
    send_message($body->data->fromNumber, $message);
    $message = "⛔ La imágen NO cumple con los requisitos o no se encuentra ingresado al sistema 📷 . Recuerda, debe tener un fondo de color claro y no utilizar lentes de sol ni mascarilla 😬.";
    send_message_timeout($body->data->fromNumber, $message, 15);
}
else {
    $message = "Hola 🤗 ".$name.", soy el Asistente Virtual de Caja Ande 🤓".
        "\\n*Nuestra Caja, tu futuro!*".
        "\\n Selecciona una opción para poder ayudarte:" .
        "\\n*1.* Jubilados y pensionados" .
        "\\n*2.* Proveedores".
        "\\n*99.* Obtener Motivos Créditos (API TEST)";
    send_message($body->data->fromNumber, $message);
}
?>
