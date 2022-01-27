<?php


function nearest($lat, $lon) {
    $message = "";
    $servername = "localhost";
    $username = "root";
    $password = "NticPlatform2016";
    $dbname = "virtual_agent_puntofarma";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
        $message = "connection failed". $conn->connect_error;
    }
    mysqli_set_charset( $conn, 'utf8');
    $sql = "SELECT id, name, address, phone, url, lat, lon, 
                SQRT( POW( 69.1 * ( lat - $lat ) , 2 ) + POW( 69.1 * ( $lon - lon ) * COS( lat / 57.3 ) , 2 ) ) AS distance
                FROM sucursales
                HAVING distance <2500
                ORDER BY distance
                LIMIT 1";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $away_distance = "";
        while($row = $result->fetch_assoc()) {
            $distance = $row["distance"]/1.60934;
            if ($distance < 1) {
                $distance = $distance*1000;
                $away_distance = number_format($distance) . " mts.";
            }
            else {
                $away_distance = number_format($distance, 1) . " kms.";
            }
            $message = "" . $row["url"]. "\\n\\n*" . $row["name"]. "*\\nDirección: " . $row["address"]. "\\nTeléfono: " . $row["phone"] . "\\nDistancia: " . $away_distance;
        }
    } else {
        $message = "0 results";
    }
    $conn->close();
    return $message;
}


