<?php
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
        CURLOPT_POSTFIELDS => "{\"phone\":\"".$number."\",\"message\":\"".$body."\",\"device\":\"61e5bb67625a563809c2fca8\"}",
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json",
            "token: 9db5765ad945eb5b106ecc549ec63f47c91a35a9d440fc45aa8d0cab5f1bd083871c53931c3feaa1"
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
}function send_message_timeout($number, $body, $seconds) {
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.wassi.chat/v1/messages",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\"phone\":\"".$number."\",\"message\":\"".$body."\",\"device\":\"61e5bb67625a563809c2fca8\",\"schedule\":{\"delay\":".$seconds."}}",
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json",
            "token: 9db5765ad945eb5b106ecc549ec63f47c91a35a9d440fc45aa8d0cab5f1bd083871c53931c3feaa1"
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
function send_location($number, $location) {
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.wassi.chat/v1/messages",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\"phone\":\"".$number."\",\"location\":\"".$location."\"}",
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json",
            "token: 9db5765ad945eb5b106ecc549ec63f47c91a35a9d440fc45aa8d0cab5f1bd083871c53931c3feaa1"
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


function send_image($number,$id,$message) {
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.wassi.chat/v1/messages",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\"phone\":\"".$number."\",\"media\":{\"file\":\"".$id."\",\"format\":\"native\",\"message\":\"".$message."\"},\"device\":\"61e5bb67625a563809c2fca8\"}",
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json",
            "token: 9db5765ad945eb5b106ecc549ec63f47c91a35a9d440fc45aa8d0cab5f1bd083871c53931c3feaa1"
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


function send_contact($number, $contact, $contact_name, $subject ="") {
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.wassi.chat/v1/messages",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\"phone\":\"".$number."\",\"contacts\":[{\"phone\":\"".$contact."\",\"name\":\"".$contact_name."\"}],\"device\":\"61e5bb67625a563809c2fca8\"}",
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json",
            "token: 9db5765ad945eb5b106ecc549ec63f47c91a35a9d440fc45aa8d0cab5f1bd083871c53931c3feaa1"
        ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        echo $response;
        send_message_wp1($number, $subject);
    }
}

function send_message_wp1($number, $body ="") {
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.wassi.chat/v1/messages",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\"phone\":\"".$number."\",\"message\":\"".$body."\",\"device\":\"61e5bb67625a563809c2fca8\"}",
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json",
            "token: 9db5765ad945eb5b106ecc549ec63f47c91a35a9d440fc45aa8d0cab5f1bd083871c53931c3feaa1"
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

function connect_to_db() {
    $host = "asistente-virtual-rds.coo2snytbquk.us-east-1.rds.amazonaws.com";
    $db = "asistentevirtualdb";
    $username = "asistentevirtual";
    $pass = "wit2021$";

    $connection = mysqli_connect($host, $username, $pass, $db);

    if (mysqli_connect_errno($connection)) {
        echo "Fallo al conectar a MySQL: " . mysqli_connect_error();
        return "Error";
    }

    return $connection;
}
function disconnect_from_db($connection) {
    return mysqli_close($connection);
}

function user_has_recent_log($whatsapp_number) {
    date_default_timezone_set("UTC");

    $today = date("Y-m-d H:i:s");

    $link = connect_to_db();

    $result = mysqli_query($link, "SELECT last_message FROM logs_agradecimientos WHERE whatsapp_number = ".$whatsapp_number." ORDER BY id DESC LIMIT 1");
    
    $row = mysqli_fetch_assoc($result);

    if (is_null($row)) {
        disconnect_from_db($link);

        return false;
    }

    $diff = (strtotime($today)-strtotime($row['last_message']))/60;

    if (abs($diff) > 10) {
        disconnect_from_db($link);

        return false;
    }

    disconnect_from_db($link);

    return true;
}

function insert_log($whatsapp_number) {
    $link = connect_to_db();
    date_default_timezone_set("UTC");
    $today = date("Y-m-d H:i:s");

    $query = "INSERT INTO logs_agradecimientos (whatsapp_number, last_message) VALUES ('".$whatsapp_number."', '".$today."')";

    if(mysqli_query($link, $query) === TRUE) {
        echo 'Se creo el registro';
        return true;
    }

    echo 'No se creo el registro';
    return false;
}
?>
