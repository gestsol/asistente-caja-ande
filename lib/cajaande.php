<?php
function get_motivo_credito()
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_URL => "http://172.16.203.9:8080/cjppa/rest/motivocredito/",
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json"
        ),
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_SSL_VERIFYPEER => false
    ));

    $response = json_decode(curl_exec($curl));
    $err = curl_error($curl);

    curl_close($curl);
    return $response;
}
?>