<?php	
    accesgudang();
	  $template = "dashboard";
    $judul = "Tambah Supplier";
    $active2="active";
    
    $a=$_POST['nama'];
    $b=$_POST['alamat'];
    $c=$_POST['telp'];
    $t=$_POST['tombol'];
    
     if ($t)
    {
      if($a!="" and $b!="" and $c!="")
      {
      $tabel="supplier";
      $field="nama,alamat,telp";
      $value="'$a','$b','$c'";
      $alert=Tambah($tabel,$field,$value);
      }
      else
      {
         $alert=Alert($jenis="info",$peringatan="Data Gagal di Tambah",$keterangan="Periksa Kembali Inputan");
      }
    }
    
    $konten = "
    <div class='d-sm-flex align-items-center justify-content-between mb-4'>
	   <h3 class='mb-0 text-gray-800'><i class='fas fa-store-alt'></i>    Supplier Tambah</h3>
	</div>
	<div class='card shadow mb-4'>
		<div class='card-body'>
			  <form action='' method='POST'  autocomplete='off'>
                <div class='form-group row'>
                      <label class='col-sm-1  col-form-label-sm'>ID</label>
                    <div class='col-sm-5'>
                      <input type='text' class='form-control form-control-sm' readonly placeholder='Auto'>
                    </div>
                  </div>
               <div class='form-group row'>
                        <label class='col-sm-1  col-form-label-sm'>Nama</label>
                      <div class='col-sm-4'>
                        <input type='text' class='form-control form-control-sm' name='nama'>
                      </div>
                    </div>
                <div class='form-group row'>
                        <label class='col-sm-1  col-form-label-sm'>Alamat</label>
                      <div class='col-sm-4'>
                        <input type='text' class='form-control form-control-sm' name='alamat'>
                      </div>
                    </div>
                  <div class='form-group row'>
                        <label class='col-sm-1  col-form-label-sm'>No.Telp</label>
                      <div class='col-sm-4'>
                        <input type='text' class='form-control form-control-sm' name='telp'>
                      </div>
                    </div>
                   <input type='submit' class='btn btn-primary ml-2' name='tombol' value='tambah'>
                  <a href='?page=gudang/supplier_list' class='btn btn-danger ml-2'>Kembali</a>
                </form>
    		</div>
    	</div>

";

?>