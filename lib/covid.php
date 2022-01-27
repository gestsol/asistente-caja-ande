<?php

function covid_get()
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_URL => "https://coronavirus-19-api.herokuapp.com/countries/chile",
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
function cases_get()
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_URL => "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=Country_Region%3D%27Chile%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Confirmed%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true",
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
function deaths_get()
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_URL => "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=Country_Region%3D%27Chile%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Deaths%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true",
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
function recovered_get()
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_URL => "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases/FeatureServer/1/query?f=json&where=Country_Region%3D%27Chile%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B\"statisticType\"%3A\"sum\"%2C\"onStatisticField\"%3A\"Recovered\"%2C\"outStatisticFieldName\"%3A\"value\"%7D%5D&outSR=102100&cacheHint=true",
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
function covid_return()
{
    $cases = cases_get();
    $deaths = deaths_get();
    $recovered = recovered_get();
    $text = "Según la OMS en Chile se han confirmado ".$cases->features[0]->attributes->value." casos. A la fecha han fallecido ".$deaths->features[0]->attributes->value." personas y se han recuperado ".$recovered->features[0]->attributes->value;
    return $text;
}