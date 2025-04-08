<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');


$dbhost = $_GET["dbhost"];
$dbuser = $_GET["dbuser"];
$dbpass = $_GET["dbpass"];
$dbname = $_GET["dbname"];
$dblimit = $_GET["dblimit"];
$dbwhcode = $_GET["dbwhcode"];
$Scenario = $_GET["Scenario"];

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

/* Set session timeout settings
$timeoutSettings = [
    "net_read_timeout" => 300,
    "net_write_timeout" => 300,
    "interactive_timeout" => 300,
    "wait_timeout" => 300,
    "max_allowed_packet" => 16777216 // 16MB
];

foreach ($timeoutSettings as $key => $value) {
    if (!$dblink->query("SET SESSION $key = $value")) {
        echo json_encode(["error" => "Failed to set $key"]);
        exit();
    }
}*/

//if (!$dblink->query("SET SESSION max_execution_time = 300000")) {
//    echo json_encode(["error" => "Failed to set max execution time"]);
//    exit();
//}


switch ($Scenario) {
    case "Scenario1":
        //$result = $dblink->query("SELECT * FROM vwstock order by stkbar_name LIMIT " . $dblimit);
        $result = $dblink->query("SELECT * FROM vwstock where stkbar_price is not null and whcode = '" . $dbwhcode . "'" . "  order by stkbar_name");
        break;
    case "Scenario2":
        $result = $dblink->query("SELECT * FROM vwstock where whcode = '" . $dbwhcode . "'" . "  order by stkbar_name");
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
