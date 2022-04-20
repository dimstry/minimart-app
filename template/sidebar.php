<?php
    switch ($_SESSION['jenis_log'])
    {
        case "1":
             include("menu_pemilik.php");
         break;
         case "2":
             include("menu_gudang.php");
         break;
         case "3":
             include("menu_kasir.php");
         break;
    }
	$sidebar="
	 
     $menu_sidebar

	";
?>
