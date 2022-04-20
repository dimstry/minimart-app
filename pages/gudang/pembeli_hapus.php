<?php
	$id=$_GET['id'];
    $tgl=$_GET['tgl'];
    $h=Hapus("beli_barang","id_pembelian='$id'");
    
    if ($h) 
    {
    	 header("location:?page=gudang/pembeli_list&tgl=$tgl&h=true");
    }
    else
    {
    	 header("location:?page=gudang/pembeli_list&tgl=$tgl&h=false");
    }
    
    
?>