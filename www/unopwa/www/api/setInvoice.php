<?php
header('Access-Control-Allow-Origin: *');


$dbhost = $_GET["dbhost"];
$dbuser = $_GET["dbuser"];
$dbpass = $_GET["dbpass"];
$dbname = $_GET["dbname"];
$inv = $_GET["invoice"];


//$arrSQL = [];
$strSQL = "";
$isFirst = true;
$inp_id = "";

if (empty($dbhost) || empty($dbuser) || empty($dbpass) || empty($dbname) || empty($inv)) {
    exit();
}


//Create database connection
$dblink = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

//Check connection was successful
if ($dblink->connect_errno) {
    printf("Failed to connect");
    exit();
}


try {

    $strSQL = "Insert into invoice(inp_id,customer_id,warehid,inp_vdate,inp_desc,inv_type,inc_id,stkbar_id,inc_qty,inc_price,inc_cost) Values ('";
    $strSQL .= $inv['inp_id'] . "','" . $inv['client_id'] . "','" . $inv['warehid'] . "','" . $inv['inv_edate'];
    $strSQL .= "','" . $inv['description'] . "','" . $inv['inv_type'] . "','" . $inv['inc_id'] . "','" . $inv['stkbar'];
    $strSQL .= "'," . $inv['inc_qty'] . "," . $inv['inc_price'] . "," . $inv['inc_cost'] . ");";

    if ($dblink->query($strSQL) === TRUE) {
        echo "1";
    } else {
        echo $conn->error;
    }

    $dblink->close();



} catch (Exception $e) {
    // An exception has been thrown
    // We must rollback the transaction

    echo "0";
}




?>
