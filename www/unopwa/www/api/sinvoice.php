<?php
header('Access-Control-Allow-Origin: *');
//header("Content-Type: text/plain");
//header('Content-Type:text/html');

$dbhost = $_POST["dbhost"];
$dbuser = $_POST["dbuser"];
$dbpass = $_POST["dbpass"];
$dbname = $_POST["dbname"];
$invoice = $_POST["invoice"];


//$arrSQL = [];
$strSQL = "";
$isFirst = true;
$inp_id = "";

if (empty($dbhost) || empty($dbuser) || empty($dbpass) || empty($dbname) || empty($invoice)) {
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
    $dblink->begin_transaction();
    foreach($invoice as $inv) {
        if ($isFirst == true) {
            $strSQL = "Insert into inv_parent(inp_id,customer_id,warehid,inp_vdate,inp_desc,inv_type,lat,lng,salesman_id,disc,location_id,iscash,location_code) Values ('";
            $strSQL .= $inv['inp_id'] . "','" . $inv['client_id'] . "','" . $inv['warehid'] . "','" . $inv['inv_edate'];
            $strSQL .= "','" . $inv['description'] . "','" . $inv['inv_type'] . "'," . $inv['lat'] . "," . $inv['lng'] . ",'" . $inv['salesmanid'] . "','" . $inv['disc'] . "','" . $inv['locationid'] . "','" . $inv['iscashvalue'] . "','" . $inv['locationcode'] . "');";
            $inp_id = $inv['inp_id'];
            $isFirst = false;
            $dblink->query($strSQL);
        } else {
            $strSQL = "Insert into inv_child(inp_id,inc_id,stkbar_id,inc_qty,inc_cost,inc_vat,inc_price) Values ('";
            $strSQL .= $inp_id . "','" . $inv['inc_id'] . "','" . $inv['stkbar_id'] . "'," . $inv['inc_qty'];
            $strSQL .= "," .  $inv['inc_cost'] . "," . $inv['inc_vat'] . "," .  $inv['inc_price'] . ");";
            $dblink->query($strSQL);
        }
    }



    if ($isFirst == false) { // means atleast 2 lines
        $dblink->commit();
        echo "1";
    } else {
        $dblink->rollback();
        echo "0";
    };




} catch (Exception $e) {
    // An exception has been thrown
    // We must rollback the transaction
    $dblink->rollback();
    echo "0";
}


//$allinvoices = json_decode($invoice);
//echo $allinvoices;

/*foreach($arrSQL as $stmt) {
    echo $stmt . "\n";

}*/



?>
