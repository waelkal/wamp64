<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');


$dbhost = $_GET["dbhost"];
$dbuser = $_GET["dbuser"];
$dbpass = $_GET["dbpass"];
$dbname = $_GET["dbname"];
$counter = $_GET["counter"];


$isFirst = false;
if (empty($dbhost) || empty($dbuser) || empty($dbpass) || empty($dbname) || empty($Scenario)) {
    exit();
}

//Create database connection
  $dblink = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

//Check connection was successful
  if ($dblink->connect_errno) {
     printf("Failed to connect");
     exit();
  }

    //$result = $dblink->query("update IFNULL(max(Sys_Ref)+1, 1) from counter where Location_code = '" . $dblocationcode . "' and type='" . $inv['inv_type'] . "' and invoiceyear=year('". $inv['inv_edate'] ."') ");
    //$result = $dblink->query("update  counter set Sys_Ref='" . $counter['sysref'] . "' where Location_code = '" . $counter['locationcode'] . "' and type='" . $counter['invtype'] . "' and invoiceyear='". $counter['year'] ."'");

try {
           
     //$strSQL = "Insert into counter(Sys_Ref,Location_code,type,invoiceyear) Values (";
     //$strSQL .= $counter['sysref'] . ",'" . $counter['locationcode'] . "','" . $counter['invtype'] . "','" . $counter['year'] . "');";           

     $strSQL = "Insert into counter (Sys_Ref,Location_code,type,invoiceyear)  
           Values ('$counter['sysref']','$counter['locationcode']','$counter['invtype']','$counter['year']')";
     $dblink->query($strSQL);

    if ($dblink->query($strSQL) === true) { // means atleast 2 lines       
        echo "1";
    } else {
        echo $strSQL . " " . $dblink->error;
    }
    $dblink->close();

} catch (Exception $e) {
    
    echo "0";
}


?>
