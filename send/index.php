<?php
header("Access-Control-Allow-Origin: *");

function send_message($number, $body) {
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.wassi.chat/v1/messages",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\"phone\":\"".$number."\",\"message\":\"".$body."\"}",
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json",
            "token: ec732c01309b8fe2c7f2aa5e9e0014024c0cd24e994efe34c0dc5b788cc2913c9ca7972a479c268c"
        ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        echo $response;
    }
}


$phone = $_REQUEST['phone'];
$firstname = $_REQUEST['firstname'];
$lastname = $_REQUEST['lastname'];
$prefix = $_REQUEST['prefix'];
$project = $_REQUEST['project'];

$prefix = strlen($phone) > 9 ? '+59' : '+56';
$text = "*$firstname $lastname* te damos la bienvenida a *Palmaroga Hotel*, el único que antes de su estreno ya contaba con 118 años de historia. Un viaje al pasado para vivir el extraodinario encanto de 1900, y también al futuro para sentir el confort de última generación. Cada detalle está pensado para sorprender y emocionar, y cada momento para que sea histórico.\\n\\n*Desayuno*\\nComience su día con un desayuno completo, incluyendo nuestra tradicional chipa y sopa paraguaya.\\n\\n*WI-FI*\\nManténgase conectado con Wi-fi gratuito en todas las habitaciones, suites y áreas sociales.\\n\\n*Piscina*\\nDisponible todo el año para nuestros huéspedes con servicio de toallas.\\n\\n*Fitness center*\\nEquipado con cintas para correr, bicicletas estáticas y mancuernas \\n\\n*Estacionamiento*\\n\\n*Servicio de lavandería*\\n\\n*Servicios de limpieza en seco*\\n\\n*Recepción*\\n\\nVer más en:\\nhttps://www.palmaroga.com/";
send_message($prefix.$phone, $text);