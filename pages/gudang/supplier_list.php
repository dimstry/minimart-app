 <?php  
    accesgudang();
    $template = "dashboard";
    $judul = "Supplier";
    $active2="active";
    
    $id=$_GET['id'];
    //MENAMPILKAN Alert KONFIRMASI SEBELUM DIHAPUS

    $p=$_GET['p'];
    switch($p)
    {
        case "tanya":
            $alert=towewengkonfirm("?page=gudang/supplier_hapus&id=$id");
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
    
    $query_select="SELECT * FROM supplier";
    $tampil=mysqli_query($koneksi,$query_select);
    foreach ($tampil as $key )
    {
      $no++;
      $t.="
       <tbody>
            <tr>
                <td>$no</td>
                <td>{$key['nama']}</td>
                <td>{$key['alamat']}</td>
                <td>{$key['telp']}</td>
                <td>
                <a href='?page=gudang/supplier_edit&id={$key['id_supplier']}' class='btn btn-success btn-sm'><i class='fas fa-edit'></i></a>
                <a href='?page=$page&id={$key['id_supplier']}&p=tanya' class='btn btn-danger btn-sm'><i class='fas fa-times'></i></a>
                </td>
            </tr>
        </tbody>
      ";
    }
    $konten = "
        <div class='d-sm-flex align-items-center justify-content-between mb-4'>
           <h3 class='mb-0 text-gray-800'><i class='fas fa-store-alt''></i>    SUPPLIER LIST</h3>
            <div class='d-flex flex-row-reverse'>
            
            <a href='?page=gudang/supplier_tambah' class='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-2'><i class='fas fa-plus'></i></a>
        </div>
        </div>
       
      <div class='card shadow mb-4'>
        <div class='card-body'>
          <div class='table-responsive mt-4'>
                      <table class='table table-bordered text-center' id='datatable' width='100%' cellspacing='0'>
                          <thead>
                          <tr>
                              <th>No</th>
                              <th>Nama</th>
                              <th>Alamat</th>
                              <th>No.Telp</th>
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