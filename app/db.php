<?php 
	$koneksi = mysqli_connect("127.0.0.1", "root", "", "db_dimas");
	if (!$koneksi)
	{
		die("Database tidak konek");
	}
 ?>