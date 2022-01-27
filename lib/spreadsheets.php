<?php

function state_get($cell)
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_URL => "https://sheets.googleapis.com/v4/spreadsheets/1k0WV8cUwHBheBRjJVMycWIlvvnx6OGGUlUEZEX1gfgs/values/Estados!".$cell."?key=AIzaSyDovwY4nyAVUZTjJkaiJ-ha91rSKhI8Hi8",
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json"
        ),
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_SSL_VERIFYPEER => false
    ));

    $response = json_decode(curl_exec($curl));
    // print_r(json_encode($response));
    $err = curl_error($curl);

    curl_close($curl);
    return $response;
}
function state_return()
{
    $text = "";
    $item = state_get("D2");

    foreach ($item->values[0] as $i) {
        $text = $i;
    }

    return $text;
}

function boxes_return()
{
    $text = "";
    $item = state_get("D3");

    foreach ($item->values[0] as $i) {
        $text = $i;
    }

    return $text;
}


function terminal_return()
{
    $text = "";
    $item = state_get("D4");

    foreach ($item->values[0] as $i) {
        $text = $i;
    }

    return $text;
}
function alameda_return()
{
    $text = "";
    $item = state_get("D5");

    foreach ($item->values[0] as $i) {
        $text = $i;
    }

    return $text;
}
function consejos_return()
{
    $text = "";
    $item = state_get("D6");

    foreach ($item->values[0] as $i) {
        $text = $i;
    }

    return $text;
}
function web_return()
{
    $text = "";
    $item = state_get("D15");

    foreach ($item->values[0] as $i) {
        $text = $i;
    }

    return $text;
}
function covid_google_return()
{
    $cases = "";
    $item = state_get("D18");
    foreach ($item->values[0] as $i) {
        $cases = $i;
    }
    $deaths = "";
    $item = state_get("D19");
    foreach ($item->values[0] as $i) {
        $deaths = $i;
    }
    $recovered = "";
    $item = state_get("D20");
    foreach ($item->values[0] as $i) {
        $recovered = $i;
    }
    $text = "Según la OMS en Chile se han confirmado ".$cases." casos. A la fecha han fallecido ".$deaths." personas y se han recuperado ".$recovered.".";
    return $text;
}
function get_id_return($id)
{
    $result = "";
    $item = state_get($id);
    foreach ($item->values[0] as $i) {
        $result = $i;
    }
    return $result;
}
function faq_return($location)
{
    $text = "";
    $item = state_get($location);

    foreach ($item->values[0] as $i) {
        $text = $i;
    }

    return $text;
}