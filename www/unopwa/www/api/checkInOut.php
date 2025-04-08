<?php
header('Access-Control-Allow-Origin: *');

// Your MYSQL database connection settings
$dbhost = $_GET["dbhost"];
$dbuser = $_GET["dbuser"];
$dbpass = $_GET["dbpass"];
$dbname = $_GET["dbname"];
$salesman_id = $_GET["custsalesmanid"];
$id = $_GET["CheckInOut_id"];
$customer_id = $_GET["customer_id"];
$action = $_GET["action"];
$timestamp = $_GET["currentdate"];
// Create connection

if (empty($dbhost) || empty($dbuser) || empty($dbpass) || empty($dbname)) {
  exit();
}

//Create database connection
$dblink = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

//Check connection was successful
if ($dblink->connect_errno) {
  printf("Failed to connect");
  echo "Failed to connect";
  exit();
}

try {

if ($action == 'checkin') {
    $strSQL = "INSERT INTO checkin_checkout (id,salesman_id, customer_id, checkin_time) VALUES ('$id','$salesman_id', '$customer_id', '$timestamp')";
} else if ($action == 'checkout') {
    $strSQL = "UPDATE checkin_checkout SET checkout_time = '$timestamp' WHERE salesman_id = '$salesman_id' AND customer_id = '$customer_id' AND checkout_time IS NULL";
}

if ($dblink->query($strSQL) === TRUE) {
    echo "1";
  } else {
    echo $strSQL . " " . $dblink->error;
  }

  $dblink->close();



} catch (Exception $e) {
  // An exception has been thrown
  // We must rollback the transaction

  echo "0";
}

?>
