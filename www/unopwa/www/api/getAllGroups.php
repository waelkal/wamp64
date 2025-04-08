<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');


$dbhost = $_GET["dbhost"];
$dbuser = $_GET["dbuser"];
$dbpass = $_GET["dbpass"];
$dbname = $_GET["dbname"];

if (empty($dbhost) || empty($dbuser) || empty($dbpass) || empty($dbname)) {
    exit();
}

//Create database connection
$dblink = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

//Check connection was successful
if ($dblink->connect_errno) {
    printf("Failed to connect");
    exit();
}

//Fetch 3 rows from actor table
$result = $dblink->query("select * from stockclassification order by gr_name,sbg_name,ssbg_name");

//Initialize array variable
$dbdata = array();

//Fetch into associative array
while ( $row = $result->fetch_assoc())  {
    $dbdata[]=$row;
}

//Print array in JSON format
echo json_encode($dbdata,JSON_UNESCAPED_UNICODE);

?>
