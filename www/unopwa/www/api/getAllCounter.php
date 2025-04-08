<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');


$dbhost = $_GET["dbhost"];
$dbuser = $_GET["dbuser"];
$dbpass = $_GET["dbpass"];
$dbname = $_GET["dbname"];
$dblocationcode = $_GET["dblocation"];


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



    $result = $dblink->query("SELECT * FROM counter where location_code='" . $dblocationcode . "'");



//Fetch 3 rows from actor table


//Initialize array variable
  $dbdata = array();

//Fetch into associative array
  while ( $row = $result->fetch_assoc())  {
	$dbdata[]=$row;
  }

//Print array in JSON format
 echo json_encode($dbdata,JSON_UNESCAPED_UNICODE);

?>
