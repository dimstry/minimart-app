<?php	
    accesgudang();
	  $template = "dashboard";
    $judul = "Edit Barang";
    $active1="active";
    $id=$_GET["id"];
    $var2=$_POST["barcode"];
    $var3=$_POST["nama"];
    $var4=$_POST["harga"];
    $tombol=$_POST["tombol"];
    $tabel="barang";
    $kunci="id_barang='$id'";

    if ($tombol) 
    {
        if ($var2!="" and $var3!="" and $var4!="") 
        {
           $field="
          barcode='$var2',
          nama='$var3',
          harga='$var4'
          ";
          $alert=Edit($tabel,$field,$kunci);
        }
        else 
        {
          $alert=Alert($jenis="info",$peringatan="Data Gagal di Tambah",$keterangan="Periksa Kembali Inputan");
        }
     
    }
    
    $q=AmbilData($tabel,$kunci);
    $a="$q[barcode]";
    $b="$q[nama]";
    $c="$q[harga]";
    $d="$q[stok]";
    
    $konten = "
    <div class='d-sm-flex align-items-center justify-content-between mb-4'>
	   <h3 class='mb-0 text-gray-800'><i class='fas fa-box-open'></i>    Barang Edit</h3>
	</div>
	<div class='card shadow mb-4'>
		<div class='card-body'>
			  <form action='' method='POST'  autocomplete='off'>
                  <div class='form-group'>
                        <label class='col-sm-1  col-form-label-sm'>Barcode</label>
                      <div class='col-sm-4'>
                        <input type='text' class='form-control form-control-sm' name='barcode' value='$a'>
                      </div>
                    </div>
                  <div class='form-group'>
                        <label class='col-sm-1  col-form-label-sm'>Nama</label>
                      <div class='col-sm-4'>
                        <input type='text' class='form-control form-control-sm' name='nama' value='$b'>
                      </div>
                    </div>
                  <div class='form-group'>
                        <label class='col-sm-1  col-form-label-sm'>Harga</label>
                      <div class='col-sm-4'>
                        <input type='text' class='form-control form-control-sm' name='harga' value='$c'>
                      </div>
                    </div>
                  
                   <input type='submit' class='btn btn-success ml-2' name='tombol' value='Update'></input>
                  <a href='?page=gudang/barang_list' class='btn btn-danger ml-2'>Kembali</a>
                </form>
            
    		</div>
    	</div>

";

?>