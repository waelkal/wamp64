<?php
header('Access-Control-Allow-Origin: *');


    $conn = new mysqli( "85.187.140.34", "cwebshrt_Mobile", "P@ssw0rd2022","cwebshrt_Lpharm");
    if ($conn->connect_errno) {
    printf("Failed to connect: " .$conn->connect_errno);
    exit();}
    else
{  
    printf(" connect");}
    


  
?>
