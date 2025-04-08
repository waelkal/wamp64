<?php
header('Access-Control-Allow-Origin: *');


$dbhost = $_GET["dbhost"];
$dbuser = $_GET["dbuser"];
$dbpass = $_GET["dbpass"];
$dbname = $_GET["dbname"];
$invoice = $_GET["invoice"];
$warehid = $_GET["dbwarehid"];
$Dwarehid = $_GET["dbdwarehid"];
$locationcode = $_GET["dblocationcode"];


//$arrSQL = [];
$strSQL = "";
$isFirst = true;
$inv_type = "";

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
    //$dblink->begin_transaction();
    foreach($invoice as $inv) {
        if ($isFirst == true){
        $inv_type = $inv['inv_type'];
        $isFirst=false;
        
        }
       else {  switch ($inv_type) {
	           case 'SA':
		   $strSQL = "update stockcalculatevalue set qun_onhand = qun_onhand-'" . $inv['inc_qty'] . "' where stkbar_id = '" . $inv['stkbar_id'] . "' and warehid= '" . $warehid . "' ;";      
       $dblink->query($strSQL);
		    break;
	           case 'SR':
		   $strSQL = "update stockcalculatevalue set qun_onhand = qun_onhand+'" . $inv['inc_qty'] . "' where stkbar_id = '" . $inv['stkbar_id'] . "' and warehid= '" . $warehid . "' ;";      
       $dblink->query($strSQL);
		   break;
             case 'DM':
		   $strSQL = "update stockcalculatevalue set qun_onhand = qun_onhand-'" . $inv['inc_qty'] . "' where stkbar_id = '" . $inv['stkbar_id'] . "' and warehid= '" . $Dwarehid . "' ;";      
       $dblink->query($strSQL);
		   break;
	           default:
		  // $strSQL = "update stockcalculatevalue set qun_onhand = qun_onhand where stkbar_id = '" . $inv['stkbar_id'] . "' and warehid= '" . $warehid . "';";
       //$dblink->query($strSQL);
		   break;
       }
       }
      
    }

    if ($dblink->query($strSQL) === TRUE) {
    echo "1";
      } else {
    echo $strSQL . " " . $dblink->error;
      } $dblink->close();

    //if ($isFirst == false) { // means atleast 2 lines
       // $dblink->commit();
       // echo "1";
    //} else {
    //    $dblink->rollback();
    //    echo "0";
   // };




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
