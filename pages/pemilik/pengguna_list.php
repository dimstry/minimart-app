<?php	
    accespemilik();
	$template = "dashboard";
    $judul = "List Pengguna";
    $active1="active";
    $h=$_POST['hapus'];

    $id=$_GET['id'];

    //MENAMPILKAN TOWEWENG KONFIRMASI SEBELUM DIHAPUS

    $p=$_GET['p'];
    switch($p)
    {
        case "tanya":
            $alert=towewengkonfirm("?page=pemilik/pengguna_hapus&id=$id");
        break;
    }

    //TOWEWENG SETELAH DIHAPUS

    $h=$_GET['h'];
    switch($h)
    {
        case "true":
            $alert=Alert("success","Data telah dihapus");
        break;
        case "false":
            $alert=Alert("info","Maaf Data tidak dapat dihapus");
        break;
    }
    
    $query_select="SELECT * FROM pengguna";
    $tampil=mysqli_query($koneksi,$query_select);
        
   
    foreach ($tampil as $key )
    {
     	$nomor++;
     	$t.="
            <tbody>
                <tr>
                    <td>$nomor</td>
                    <td>{$key['username']}</td>
                    <td>{$key['nama']}</td>
                    <td>".status($key['status'])."</td>
                    <td>".Level($key['level'])."</td>
                    <td> 
                        <a href='?page=pemilik/pengguna_edit&id={$key['id_pengguna']}' class='btn btn-success btn-sm'><i class='fas fa-edit'></i></a>
                        <a href='?page=pemilik/pengguna_reset&id={$key['id_pengguna']}' class='btn btn-warning btn-sm'><i class='fas fa-lock'></i></a>
                        <a href='?page=$page&id={$key['id_pengguna']}&p=tanya' class='btn btn-danger btn-sm'><i class='fas fa-times'></i></a>
                    </td>
                </tr>
            </tbody>
		";
    }

    $konten = "
        <div class='d-sm-flex align-items-center justify-content-between mb-4'>
            <h3 class='mb-0 text-gray-800'><i class='fas fa-users'></i>    Pengguna</h3>
            <a href='?page=pemilik/pengguna_tambah' class='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'><i class='fas fa-plus'></i></a>
        </div>
        <div class='card shadow mb-4'>
                <div class='card-header py-3'>
                    <h6 class='m-0 font-weight-bold text-primary'>Pengguna</h6>
                </div>
                    <div class='card-body'>
                        <div class='table-responsive'>
                            <table class='table table-bordered text-center' id='datatable' width='100%' cellspacing='0'>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Ussername</th>
                                        <th>Nama</th>
                                        <th>Status</th>
                                        <th>Level</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                    $t
                            </table>
                        </div>
                    </div>
        </div>
    ";

?>