<?php
header('Access-Control-Allow-Origin: *');


$dbhost = $_GET["dbhost"];
$dbuser = $_GET["dbuser"];
$dbpass = $_GET["dbpass"];
$dbname = $_GET["dbname"];
$custsalesmanid = $_GET["custsalesmanid"];
$CompanyCode = $_GET["CompanyCode"];
$NameOfCustomer = $_GET["NameOfCustomer"];
$BusAdr = $_GET["BusAdr"];
$BusMob = $_GET["BusMob"];
$BusPhn = $_GET["BusPhn"];
$region= $_GET["region"];
$customer_id = $_GET["customer_id"];


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
  $strSQL = "Insert into customer (customerid,acname,custsalesmanid,BusinessPhone1,BusinessMobile,region,BusinessAddress,companycode)  
           Values ('$customer_id','$NameOfCustomer','$custsalesmanid','$BusPhn','$BusMob','$region','$BusAdr','$CompanyCode')";

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
