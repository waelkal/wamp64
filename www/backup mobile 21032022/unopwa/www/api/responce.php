<?php
header('Access-Control-Allow-Origin: *');


    $conn = new mysqli( "192.185.196.233", "soladmin_mazen", "ugs748main99","soladmin_trading");
    if ($conn->connect_errno) {
    printf("Failed to connect: " .$conn->connect_errno);
    exit();}
    else
{  
    printf(" connect");}
    


  
?>
