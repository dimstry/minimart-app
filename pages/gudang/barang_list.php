 <?php  
    accesgudang();
    $template = "dashboard";
    $judul = "Barang List";
    $active1="active";
    
    $id=$_GET['id'];

    //MENAMPILKAN Alert KONFIRMASI SEBELUM DIHAPUS

    $p=$_GET['p'];
    switch($p)
    {
        case "tanya":
            $alert=towewengkonfirm("?page=gudang/barang_hapus&id=$id");
        break;
    }

    //Alert SETELAH DIHAPUS

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
    
    
        
    $query_select="SELECT * FROM barang";
    $tampil=mysqli_query($koneksi,$query_select);
    foreach ($tampil as $key )
    {
      $nomor++;
     	$t.="
         <tbody>
          <tr>
              <td>$nomor</td>
              <td>{$key['barcode']}</td>
              <td>{$key['nama']}</td>
              <td>".rupiah($key['harga'])."</td>
              <td>{$key['stok']}</td>
              <td>
              <a href='?page=gudang/barang_edit&id={$key['id_barang']}' class='btn btn-success btn-sm'><i class='fas fa-edit'></i></a>
              <a href='?page=$page&id={$key['id_barang']}&p=tanya' class='btn btn-danger btn-sm'><i class='fas fa-times'></i></a>
              </td>
          </tr>
      </tbody>
     	";
    }
    
    $konten = "
        <div class='d-sm-flex align-items-center justify-content-between mb-4'>
             <h3 class='mb-0 text-gray-800'><i class='fas fa-box-open'></i>    Barang</h3>
            <div class='d-flex flex-row-reverse'>
              
              <a href='?page=gudang/lap_barang' class='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm'><i class='fas fa-print'></i></a>
              <a href='?page=gudang/barang_tambah' class='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-2'><i class='fas fa-plus'></i></a>
            </div>
        </div>
         
      <div class='card shadow mb-4'>
        <div class='card-body'>
          <div class='table-responsive mt-4'>
                      <table class='table table-bordered text-center' id='datatable' width='100%' cellspacing='0'>
                          <thead>
                          <tr>
                              <th>No</th>
                              <th>Barcode</th>
                              <th>Nama</th>
                              <th>Harga jual</th>
                              <th>Stok</th>
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