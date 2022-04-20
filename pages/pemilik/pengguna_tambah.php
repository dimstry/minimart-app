<?php	
    accespemilik();
	  $template = "dashboard";
    $judul = "Tambah Pengguna";
    $active1="active";
    
    
    
    $nama=$_POST['var01'];
    $username=$_POST['var02'];
    $password=$_POST['var03'];
    $pilih=$_POST['pilih'];
    $tombol=$_POST['tombol'];

    if ($tombol)
    {
      if($nama!="" and $username!="" and $pilih!="")
      {
        $tabel="pengguna";
        $field="username,nama,level";
        $value="'$username','$nama','$pilih'";
        $alert=Tambah($tabel,$field,$value);
      }
      else
      {
        $alert=Alert($jenis="info",$peringatan="Data Gagal di Tambah",$keterangan="Periksa Kembali Inputan");
      }
    }

    
    $konten = "
      <div class='d-sm-flex align-items-center justify-content-between mb-4'>
        <h3 class='mb-0 text-gray-800'><i class='fas fa-users'></i>    Pengguna Tambah</h3>
      </div>
        <div class='card shadow mb-4'>
          <div class='card-body'>
            <form action='' method='POST'  autocomplete='off'>
              <div class='form-group'>
                <label class='col-sm-1  col-form-label-sm'>Nama</label>
                <div class='col-sm-5'>
                  <input type='text' class='form-control form-control-sm' name='var01'>
                </div>
              </div>
              <div class='form-group'>
                <label class='col-sm-2  col-form-label-sm'>Username</label>
                <div class='col-sm-5'>
                  <input type='text' class='form-control form-control-sm' name='var02'>
                </div>
              </div>
              <div class='form-group'>
                <label class='col-sm-1  col-form-label-sm'>Level</label>
                <div class='col-sm-5'>
                  <select class='custom-select' name='pilih'  id='pilih'>
                    <option selected>-- Pilih --</option>
                    <option value='1'>Pemilik</option>
                    <option value='2'>Gudang</option>
                    <option value='3'>Kasir</option>
                  </select>
                </div>
              </div>
              <input type='submit' class='btn btn-primary ml-2' name='tombol' value='tambah'></input>
              <a href='?page=pemilik/pengguna_list' class='btn btn-danger ml-2'>Kembali</a>
            </form>
          </div>
        </div>
";

?>