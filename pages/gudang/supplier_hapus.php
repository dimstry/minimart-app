<?php
	  $id=$_GET['id'];
    $h=Hapus("supplier","id_supplier='$id'");
    
    if ($h) 
    {
    	 header("location:?page=gudang/supplier_list&h=true");
    }
    else
    {
    	 header("location:?page=gudang/supplier_list&h=false");
    }
?>