<?php	

	  $template = "dashboard";
    $judul = "Edit Pengguna";
    $active1="active";
    

    $id=$_GET['id'];
    $a1=$_POST['a1'];
    $b2=$_POST['b2'];
    $c3=$_POST['c3'];
    $d4=$_POST['d4'];
    $tombol=$_POST['tombol'];
    $tabel="pengguna";
    $kunci="id_pengguna='$id'";
    
    
     if($tombol)
     {
       if($a1!="" and $b2!="" and $c3!="" and $d4!="")
       {
         $field="
         username='$a1',
         nama='$b2',
         status='$d4',
         level='$c3'
         ";
         $alert=Edit($tabel,$field,$kunci);
       }
        else
       {
         $alert=Alert($jenis="info",$peringatan="Data Gagal di Tambah",$keterangan="Periksa Kembali Inputan");
       }

     }
    
    
    $cek=AmbilData($tabel,$kunci);;
    $cek['level'];
    switch ($cek['level']) {
      case '1':
        $pilih1="selected";
        break;
      case '2':
        $pilih2="selected";
        break;
      case '3':
        $pilih3="selected";
        break;
    }
    $cekstatus=AmbilData($tabel,$kunci);;
    $cekstatus['status'];
    switch ($cekstatus['status']) {
      case '0':
        $tidakaktif="selected";
      break;
      case '1':
        $aktif="selected";
      break;
    }

    $konten = "
    <div class='d-sm-flex align-items-center justify-content-between mb-4'>
	   <h3 class='mb-0 text-gray-800'><i class='fas fa-users'></i>    Pengguna Edit</h3>
	</div>
	<div class='card shadow mb-4'>
		<div class='card-body'>
			  <form action='' method='POST'  autocomplete='off'>
                  <div class='form-group'>
                      <label class='col-sm-1  col-form-label-sm'>username</label>
                    <div class='col-sm-5'>
                      <input type='text' class='form-control form-control-sm' name='a1' value='$cek[username]'>
                    </div>
                  </div>
                  	<div class='form-group'>
                      <label class='col-sm-5  col-form-label-sm'>Nama</label>
                    <div class='col-sm-5'>
                      <input type='text' class='form-control form-control-sm' name='b2' value='$cek[nama]'>
                    </div>
                 </div>
                <div class='form-group'>
                  <label class='col-sm-1  col-form-label-sm'>Level</label>
                  <div class='col-sm-5'>
                    <select class='custom-select' name='c3'>
                      <option selected>-- Pilih --</option>
                      <option value='1' $pilih1>Pemilik</option>
                      <option value='2' $pilih2>Gudang</option>
                      <option value='3' $pilih3>Kasir</option>
                    </select>
                  </div>
                </div>
                 <div class='form-group'>
                  <label class='col-sm-1  col-form-label-sm'>Status</label>
                  <div class='col-sm-5'>
                    <select class='custom-select' name='d4'>
                      <option selected>-- Pilih --</option>
                      <option value='0' $tidakaktif>Tidak Aktif</option>
                      <option value='1' $aktif>Aktif</option>
                      
                    </select>
                  </div>
                </div>
                  <input type='submit' class='btn btn-success ml-2' name='tombol' value='Update'></input>
                   <a href='?page=pemilik/pengguna_list' class='btn btn-danger ml-2'>
                  Kembali</a>

                </form>
		</div>
	</div>
	";
?>