<?php
	$id=$_GET['id'];
    $h=Hapus("barang","id_barang='$id'");
    
    if ($h) 
    {
    	 header("location:?page=gudang/barang_list&h=true");
    }
    else
    {
    	 header("location:?page=gudang/barang_list&h=false");
    }
    
    
?>