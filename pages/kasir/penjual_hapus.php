<?php
	$id=$_GET['id'];
    $tgl=$_GET['tgl'];
    $h=Hapus("jual_barang","id_penjualan='$id'");
    
    if ($h) 
    {
    	 header("location:?page=kasir/penjual_list&tgl=$tgl&h=true");
    }
    else
    {
    	 header("location:?page=kasir/penjual_list&tgl=$tgl&h=false");
    }
    
    
?>