<?php 
    accesgudang();
    $template = "dashboard";
    $judul = "Edit Supplier";
    $active2="active";

    $var01=$_POST["var01"];
    $var02=$_POST["var02"];
    $var03=$_POST["var03"];
    $tombol=$_POST["tombol"];
    

        
    if($tombol)
  {
    if($var01!="" and $var02!="" and $var03!="")
    {
        //masukkeun ka database
         $cek=mysqli_query($koneksi,"UPDATE supplier SET nama='$var01',alamat='$var02',telp='$var03'
         WHERE id_supplier='{$_GET['id']}'");
        $alert=Alert($jenis="success",$peringatan="success",$keterangan="Data Berhasil di Update");
    }
    else
    {
        $alert=Alert($jenis="info",$peringatan="Data Gagal di Tambah",$keterangan="Periksa Kembali Inputan");
    }

 }
    $query_supplier = mysqli_query($koneksi, "SELECT * FROM supplier WHERE id_supplier='{$_GET['id']}'");
    $cek_supplier=mysqli_fetch_assoc($query_supplier);
    $konten = "
     $keterangan_update
    <div class='d-sm-flex align-items-center justify-content-between mb-4'>
     <h3 class='mb-0 text-gray-800'><i class='fas fa-shop'></i>    Supplier Edit</h3>
  </div>
  <div class='card shadow mb-4'>
    <div class='card-body'>
        <form action='' method='POST'  autocomplete='off'>
                <div class='form-group row'>
                      <label class='col-sm-1  col-form-label-sm'>ID</label>
                    <div class='col-sm-5'>
                      <input type='text' class='form-control form-control-sm' readonly value=' $cek_supplier[id_supplier]'>
                    </div>
                  </div>
               <div class='form-group row'>
                        <label class='col-sm-1  col-form-label-sm'>Nama</label>
                      <div class='col-sm-4'>
                        <input type='text' class='form-control form-control-sm' name='var01' value='$cek_supplier[nama]'>
                      </div>
                    </div>
                <div class='form-group row'>
                        <label class='col-sm-1  col-form-label-sm'>Alamat</label>
                      <div class='col-sm-4'>
                        <input type='text' class='form-control form-control-sm'  name='var02' value='$cek_supplier[alamat]'>
                      </div>
                    </div>
                  <div class='form-group row'>
                        <label class='col-sm-1  col-form-label-sm'>No.Telp</label>
                      <div class='col-sm-4'>
                        <input type='text' class='form-control form-control-sm'  name='var03' value='$cek_supplier[telp]'>
                      </div>
                    </div>
                   <input type='submit' class='btn btn-success ml-2' name='tombol' value='Update'></input>
                  <a href='?page=gudang/supplier_list' class='btn btn-danger ml-2'>Kembali</a>
                </form>
        </div>
      </div>

";

?>