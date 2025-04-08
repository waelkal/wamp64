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

//one row only
  $result = $dblink->query("SELECT value FROM settings where setting = 'DatabaseVersion'");
  $row = $result->fetch_assoc();
  echo $row["value"];
?>
