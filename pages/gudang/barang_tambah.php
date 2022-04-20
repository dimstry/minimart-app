<?php	
    accesgudang();
	  $template = "dashboard";
    $judul = "Tambah Barang";
    $active1="active";
    $var2=$_POST["barcode"];
    $var3=$_POST["nama"];
    $var4=$_POST["harga"];
    $tombol=$_POST["tombol"];
    
    if ($tombol) 
    {
      $check_barcode=mysqli_query($koneksi, "SELECT barcode FROM barang where barcode='$var2'");
      if(mysqli_num_rows($check_barcode) > 0)
      {
        $alert=Alert($jenis="info",$peringatan="Data Gagal di Tambah",$keterangan="Data Sudah Ada");
      }
      elseif ($var2!="" AND $var3!="" AND $var4!="") 
      {
        $tabel="barang";
        $field="barcode,nama,harga";
        $value="'$var2', '$var3','$var4'";
        $alert=Tambah($tabel,$field,$value);
      }
      else 
      {
        $alert=Alert($jenis="warning",$peringatan="Data Gagal di Tambah",$keterangan="Data Tidak Boleh kosong"); 
      }
    }
    
    $konten="
    <div class='d-sm-flex align-items-center justify-content-between mb-4'>
      <h3 class='mb-0 text-gray-800'><i class='fas fa-box-open'></i>    Barang Tambah</h3>
    </div>
    <div class='card shadow mb-4'>
      <div class='card-body'>
        <form action='' method='POST'  autocomplete='off'>
          <div class='form-group'>
            <label class='col-sm-1  col-form-label-sm'>Nama</label>
            <div class='col-sm-5'>
              <input type='text' class='form-control form-control-sm' name='nama'>
            </div>
          </div>
          <div class='form-group'>
            <label class='col-sm-1  col-form-label-sm'>Harga</label>
            <div class='col-sm-5'>
              <input type='text' class='form-control form-control-sm' name='harga'>
            </div>
          </div>
          <div class='form-group'>
            <label class='col-sm-1  col-form-label-sm'>Barcode</label>
            <div class='col-sm-5'>
              <input type='text' class='form-control form-control-sm' name='barcode'>
            </div>
          </div>
          <input type='submit' class='btn btn-primary ml-2' name='tombol' value='tambah'></input>
          <a href='?page=gudang/barang_list' class='btn btn-danger ml-2'>Kembali</a>
        </form>
      </div>
    </div>
    ";

?>