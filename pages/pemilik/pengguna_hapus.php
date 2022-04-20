<?php
	$id=$_GET['id'];
	
    $h=Hapus("pengguna","id_pengguna='$id'");
    if ($h) {
    	 header("location:?page=pemilik/pengguna_list&h=true");
    }
    else
    {
    	 header("location:?page=pemilik/pengguna_list&h=false");
    }
    
   
?>