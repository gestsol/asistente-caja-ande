<?php
header("display_errors", 1);
require('lib/message.php');
require('lib/spreadsheets.php');
require('lib/covid.php');

$body = file_get_contents('php://input');
$body = json_decode($body);


$verifications = 0;
$name = "";
$phone = "";
$company_id = "";


$message = "";
if (strpos(strtolower($body->data->body), "Hola") !== false) {
    $message = "Hola, soy el Tío Pullman Virtual, ".
        "las opciones disponibles son las siguientes:".
        "\\n```(1) Estado Servicios```".
        "\\n```(2) Puntos de venta```".
        "\\n```(3) Estado Terminales```".
        "\\n```(4) Servicios en Línea```".
        "\\n```(5) Protocolo Covid 19```".
        "\\n```(6) Ver Itinerarios```".
        "\\n```(7) Documentos obligatorios para los pasajeros por contigencia Covid-19```".
        "\\n```(8) Cambio y devolución de Pasajes```".
        "\\n```(9) Dudas servicio en ruta```".
        "\\n```(10) Contactar un ejecutivo```";
    send_message($body->data->fromNumber, $message);
}
// opción 1
else if ((strpos(strtolower($body->data->body), "servicios") !== false) || (strpos(strtolower($body->data->body), "servicio") !== false) || (strpos(strtolower($body->data->body), "buses") !== false) || (strpos(strtolower($body->data->body), "bus") !== false) || strtolower($body->data->body) == 1) {
    send_message($body->data->fromNumber, state_return());

}
// opción 2
else if ((strpos(strtolower($body->data->body), "cajas") !== false) || (strpos(strtolower($body->data->body), "caja") !== false) || strtolower($body->data->body) == 2) {
    send_message($body->data->fromNumber, boxes_return());

}
// opcion 3 - 1
else if ((strpos(strtolower($body->data->body), "alameda") !== false)) {
    send_message($body->data->fromNumber, alameda_return());

}
// opcion 3
else if ((strpos(strtolower($body->data->body), "terminales") !== false) || (strpos(strtolower($body->data->body), "terminal") !== false) || strtolower($body->data->body) == 3) {
    send_message($body->data->fromNumber, terminal_return());

}
// opcion 4
else if ((strpos(strtolower($body->data->body), "online") !== false) || (strpos(strtolower($body->data->body), "web") !== false) || (strpos(strtolower($body->data->body), "internet") !== false) || (strpos(strtolower($body->data->body), "comprar") !== false) || (strpos(strtolower($body->data->body), "pagina") !== false) || strtolower($body->data->body) == 4) {
    send_message($body->data->fromNumber, web_return());

}
// opcion 5
else if ((strpos(strtolower($body->data->body), "coronavirus") !== false) || (strpos(strtolower($body->data->body), "covid") !== false) || strtolower($body->data->body) == 5) {
    send_image($body->data->fromNumber, get_id_return("D17"), covid_google_return());
    $message = "-       En la prevención del Covid-19 y el autocuidado es fundamental, por esto solicitamos a todos nuestros pasajeros que no se expongan a viajar si no es estrictamente necesario.".
        "\\n\\n-       Para quienes estén obligados a viajar hemos extremado nuestras medidas de higiene, y además de cumplir con la autoridad de salud, realizamos diariamente una sanitización profunda en todos los buses, con químicos especiales que evitan la propagación de virus. Además, contamos con termómetros para medir a la tripulación y a los pasajeros.".
        "\\n\\n-       Hoy hay controles sanitarios en la mayoría de los terminales con el fin de fiscalizar que personas en cuarentena, con fiebre, o registrados como portadores de Covid-19 no aborden los buses.".
        "\\n\\n-       Recomendamos nuestros pasajeros llevar siempre su cedula de identidad y, si es posible, una mascarilla.".
        "\\n\\n-       Si llega a su destino después del toque de queda, su pasaje y carnet servirán de salvoconducto.".
        "\\n\\n-       Si la autoridad decreta cuarentena total estamos en la obligación de suspender nuestros servicios, aun cuando los pasajeros tengan su ticket comprado.";
    send_message($body->data->fromNumber, $message);
}
// opcion 6
else if (strtolower($body->data->body) == 6) {
    $message = "Otras consultas:".
        "\\n```(61)  Norte hacia Santiago```".
        "\\n```(62) Sur hacia Santiago```".
        "\\n```(63) Costa Central hacia Santiago(Lunes a viernes)```".
        "\\n```(64) Costa Central hacia Santiago(Sábado y Domingo)```".
        "\\n```(65) Santiago hacia Norte```".
        "\\n```(66) Santiago hacia Sur```".
        "\\n```(67) Santiago hacia Costa Central```";
    send_message($body->data->fromNumber, $message);
}
// opcion 6 - 61
else if (strtolower($body->data->body) == 61) {
    send_image($body->data->fromNumber, get_id_return("B27"), "Por tu seguridad te invitamos a comprar pasajes en https://www.pullman.cl");
}
// opcion 6 - 62
else if (strtolower($body->data->body) == 62) {
    send_image($body->data->fromNumber, get_id_return("B28"), "Por tu seguridad te invitamos a comprar pasajes en https://www.pullman.cl");
}
// opcion 6 - 63
else if (strtolower($body->data->body) == 63) {
    send_image($body->data->fromNumber, get_id_return("B29"), "Por tu seguridad te invitamos a comprar pasajes en https://www.pullman.cl");
}
// opcion 6 - 64
else if (strtolower($body->data->body) == 64) {
    send_image($body->data->fromNumber, get_id_return("B30"), "Por tu seguridad te invitamos a comprar pasajes en https://www.pullman.cl");
}
// opcion 6 - 65
else if (strtolower($body->data->body) == 65) {
    send_image($body->data->fromNumber, get_id_return("B31"), "Por tu seguridad te invitamos a comprar pasajes en https://www.pullman.cl");
}
// opcion 6 - 66
else if (strtolower($body->data->body) == 66) {
    send_image($body->data->fromNumber, get_id_return("B32"), "Por tu seguridad te invitamos a comprar pasajes en https://www.pullman.cl");
}
// opcion 6 - 67
else if (strtolower($body->data->body) == 67) {
    send_image($body->data->fromNumber, get_id_return("B33"), "Por tu seguridad te invitamos a comprar pasajes en https://www.pullman.cl");
}
// opcion 7
else if (strtolower($body->data->body) == 7) {
    $message = "Documentos obligatorios para los pasajeros por contigencia Covid-19, ".
        "las opciones disponibles son las siguientes:".
        "\\n```(71) ¿Qué documentos necesito para viajar?```".
        "\\n```(72) Necesito tener documentación necesaria para viajar a una ciudad específica. ¿Dónde viaja?```";
    send_message($body->data->fromNumber, $message);
}
// opcion 7 - 71
else if (strtolower($body->data->body) == 71) {
    $message = faq_return("D30");
    send_message($body->data->fromNumber, $message);
}
// opcion 7 - 72
else if (strtolower($body->data->body) == 72) {
    $message = "Necesito tener documentación necesaria para viajar a una ciudad específica. ¿Dónde viaja?, ".
        "las opciones disponibles son las siguientes:".
        "\\n```(721) I Región```".
        "\\n```(722) II Región```".
        "\\n```(723) XV Región```".
        "\\n```(724) Chillán```".
        "\\n```(725) Temuco```".
        "\\n```(726) Osorno```".
        "\\n```(727) Ciudad en Cuarentena```";
    send_message($body->data->fromNumber, $message);
} else if (strtolower($body->data->body) == 721) {
    $message = faq_return("D32");
    send_message($body->data->fromNumber, $message);
} else if (strtolower($body->data->body) == 722) {
    $message = faq_return("D33");
    send_message($body->data->fromNumber, $message);
} else if (strtolower($body->data->body) == 723) {
    $message = faq_return("D34");
    send_message($body->data->fromNumber, $message);
} else if (strtolower($body->data->body) == 724) {
    $message = faq_return("D35");
    send_message($body->data->fromNumber, $message);
} else if (strtolower($body->data->body) == 725) {
    $message = faq_return("D36");
    send_message($body->data->fromNumber, $message);
} else if (strtolower($body->data->body) == 726) {
    $message = faq_return("D37");
} else if (strtolower($body->data->body) == 727) {
    $message = faq_return("D38");
    send_message($body->data->fromNumber, $message);
}
// opcion 8
else if (strtolower($body->data->body) == 8) {
    $message = "Cambio y devolución de Pasajes, ".
        "las opciones disponibles son las siguientes:".
        "\\n```(81) Tengo Boleto en Blanco y quiero usarlo ¿cómo debo confirmarlo?```".
        "\\n```(82) He decidido no viajar, ¿ Qué hago con el boleto que compré?```".
        "\\n```(83) Tengo boletos comprados con anticipación, pero ya no estávigente el horario del servicio ¿qué puedo hacer?```";
    send_message($body->data->fromNumber, $message);
}
// opcion 8 - 81
else if (strtolower($body->data->body) == 81) {
    $message = faq_return("D43");
    send_message($body->data->fromNumber, $message);
}
// opcion 8 - 82
else if (strtolower($body->data->body) == 81) {
    $message = faq_return("D44");
    send_message($body->data->fromNumber, $message);
}
// opcion 8 - 83
else if (intval(strtolower($body->data->body)) == 83) {
    $message = faq_return("D45");
    send_message($body->data->fromNumber, $message);
}
else if (intval(strtolower($body->data->body)) == 10) {
    $message = "Un ejecutivo se contactará contigo a tu número: " . $body->data->fromNumber . "\\nHorario de atención: Lunes a Viernes de 9:00 a 18:00 hrs.";
    send_message($body->data->fromNumber, $message);
    $name = $body->data->chat->contact->displayName != "" ? $body->data->chat->contact->displayName : "Sin nombre";
    send_contact("+56942858102", $body->data->fromNumber, $name);
    // send_contact("+56942230775", $body->data->fromNumber, $name);
    send_contact("+56963389035", $body->data->fromNumber, $name);
    send_contact("+56988565113", $body->data->fromNumber, $name);
} else if ((strpos(strtolower($body->data->body), "gracias") !== false)) {
    $message = "De nada, estaré aquí para cuando lo necesites, recuerda que puedes comprar tus pasajes en https://www.pullman.cl";
    send_message($body->data->fromNumber, $message);

} else {
    $message = "Hola, soy el Tío Pullman Virtual, ".
        "las opciones disponibles son las siguientes:".
        "\\n```(1) Estado Servicios```".
        "\\n```(2) Puntos de venta```".
        "\\n```(3) Estado Terminales```".
        "\\n```(4) Servicios en Línea```".
        "\\n```(5) Protocolo Covid 19```".
        "\\n```(6) Ver Itinerarios```".
        "\\n```(7) Documentos obligatorios para los pasajeros por contigencia Covid-19```".
        "\\n```(8) Cambio y devolución de Pasajes```".
        "\\n```(9) Dudas servicio en ruta```".
        "\\n```(10) Contactar un ejecutivo```";
    send_message($body->data->fromNumber, $message);
}
?>
