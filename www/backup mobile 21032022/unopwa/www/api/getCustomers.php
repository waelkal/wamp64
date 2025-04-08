<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');


$dbhost = $_GET["dbhost"];
$dbuser = $_GET["dbuser"];
$dbpass = $_GET["dbpass"];
$dbname = $_GET["dbname"];
$region = $_GET["region"];
$Scenario = $_GET["Scenario"];
$dbsalesmanid =$_GET["dbsalesmanid"];
$dbCashVanName=$_GET["dbCashVanName"];



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



switch ($Scenario) {
  case "Scenario1": 
      $result = $dblink->query("SELECT * FROM customer where custsalesmanid= '" . $dbsalesmanid . "' order by acname");          
     //$result = $dblink->query("SELECT * FROM customer where salesmanname like '" . $dbCashVanName . "  .%' ");
      //$result = $dblink->query("SELECT * FROM customer order by acname"); 
    break;
  case "Scenario2":
    //$result = $dblink->query("SELECT * FROM customer order by acname LIMIT 1000 ");
    break;
  case "Scenario3":
    echo "Scenario3";
    break;
  case "Scenario4":
    echo "Scenario4";
    break;
  case "Scenario5":
    echo "Scenario4";
    break;
  case "Scenario6":
    echo "Scenario4";
    break;
  default:
    $result = $dblink->query("SELECT * FROM vwstock where whcode = '" . $dbwhcode . "'" . " order by stkbar_name LIMIT " . $dblimit);
}



//Initialize array variable
  $dbdata = array();

//Fetch into associative array
  while ( $row = $result->fetch_assoc())  {
	$dbdata[]=$row;
  }

//Print array in JSON format
 echo json_encode($dbdata,JSON_UNESCAPED_UNICODE);

?>
