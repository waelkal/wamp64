<?php
header('Access-Control-Allow-Origin: *');


$dbhost = $_GET["dbhost"];
$dbuser = $_GET["dbuser"];
$dbpass = $_GET["dbpass"];
$dbname = $_GET["dbname"];
$JV = $_GET["ReceiptVouchers"];


if (empty($dbhost) || empty($dbuser) || empty($dbpass) || empty($dbname) || empty($JV) ) {
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
  $strSQL = "Insert into receiptvouchers (Trans_id,Amount,customer_id,CustomerName,Salesman_id,Location_id,Jv_type,trp_desc,inp_vdate)  
           Values ('" . $JV['inp_id'] . "','" . $JV['voucher_total'] . "','" . $JV['client_id'] . "','" . $JV['client_name'] . "','" . $JV['salesmanid'] . "','" . $JV['locationid'] . "','" . $JV['inv_type'] . "','" . $JV['description'] . "','" . $JV['inv_edate'] . "')";

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
