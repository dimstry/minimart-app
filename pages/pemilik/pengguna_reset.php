<?php	
    accespemilik();
	  $template = "dashboard";
    $judul = "Reset Pengguna";
    $active1="active";

    $tampil=mysqli_query($koneksi,"SELECT * FROM pengguna WHERE id_pengguna='{$_GET{'id'}}'");
    $cek=mysqli_fetch_assoc($tampil);
    $id=$_GET['id'];
    $a1=$cek['username'];
    $a2=$cek['nama'];
    $a3=$cek['password'];   
    $tombol=$_POST['tombol'];

    if ($tombol)
    {
      $acak=rand(1000,9999);
      $alert=ResetPengguna($acak,$id);
    }


    $konten = "
      <div class='d-sm-flex align-items-center justify-content-between mb-4'>
        <h3 class='mb-0 text-gray-800'><i class='fas fa-users'></i>    Pengguna Reset</h3>
      </div>
        <div class='card shadow mb-4'>
          <div class='card-body'>
            <form action='' method='POST'  autocomplete='off'>
              <div class='form-group'>
                <label class='col-sm-5  col-form-label-sm'>Ussername</label>
                <div class='col-sm-5'>
                  <input type='text' class='form-control form-control-sm' name='a1' value='$a1'>
                </div>
              </div>
              <div class='form-group'>
                <label class='col-sm-1  col-form-label-sm'>Nama</label>
                <div class='col-sm-5'>
                  <input type='text' class='form-control form-control-sm' name='a2' value='$a2'>
                </div>
              </div>
              <div class='form-group'>
                <label class='col-sm-1  col-form-label-sm'>password</label>
                <div class='col-sm-5'>
                  <input type='text' class='form-control form-control-sm' name='a3' value='$acak' readonly>
                </div>
              </div>
              <input type='submit' class='btn btn-warning ml-2' name='tombol' value='Reset'></input>
              <a href='?page=pemilik/pengguna_list' class='btn btn-danger ml-2'>Kembali</a>
            </form>
          </div>
        </div>
	";
?>