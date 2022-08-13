 <?php  
  accesgudang();

  $template = "dashboard";
  $judul = "Pembeli";
  $active3="active";

  $active3="active";
  $id=$_GET['id']; //kode pemblian
  $id1=$_GET['id1'];//kode barang beli
  $aksi=$_GET['aksi'];
  
  $a1=$_POST['a1'];
  $a2=$_POST['a2'];
  $a3=$_POST['a3'];
  $a4=$_POST['a4'];
  $a5=$_POST['a5'];
  $tombol=$_POST['tombol'];
  $tabel="pembelian";


  switch($tombol)
  {
      case "Baru":
          
          $field="kode, waktu, id_supplier, id_pengguna";
  
          $kode=date("YmdHis");
          $waktu=date("Y-m-d H:i:s");
          $value="'$kode','$waktu','$a2','{$_SESSION['id']}'";
          Tambah($tabel,$field,$value);
  
          $kunci="kode='$kode'";
          $qbeli=AmbilData($tabel,$kunci);
          header("location:?page=$page&id={$qbeli['id_pembelian']}");
      break;
      case "Tambah":
          TambahTrans("beli_barang",
          "id_barang,id_pembelian,banyak_beli,harga_beli",
          "'$a3','$id','$a5','$a4'");
          header("location:?page=$page&id=$id");
      break;
      case "Selesai":
          header("location:?page=$page");
      break;
      
  }
  
  switch($aksi)
  {
      case "hapus":
          Hapus("beli_barang","id_beli_barang='$id1'");
          header("location:?page=$page&id=$id");
      break;
  }
  
  if($id!="")
  {
      $kunci="id_pembelian='$id'";
      $DataBeli=AmbilData($tabel,$kunci);
      $a1=$DataBeli['kode'];
      $a2=$DataBeli['id_supplier'];
  
      // $query_select="SELECT * FROM barang_beli_list";
      // $tampil=mysqli_query($koneksi,$query_select);
      $tampil=AmbilDataAll("barang_beli_list","where id_pembelian='$id'");
      $total=0;
      foreach ($tampil as $key )
      {
          $number++;
          $data.="
              <tr>
                  <td class='text-center'>$number</td>
                  <td class='text-left'>{$key['barcode']}</td>
                  <td class='text-left'>{$key['nama']}</td>
                  <td class='text-center'>{$key['banyak_beli']}</td>
                  <td class='text-right'>".rupiah($key['harga_beli'])."</td>
                  
                  <td class='text-right'>".rupiah($key['jumlah'])."</td>
                  <td class='text-center'>
                       <a href='?page=$page&id=$id&id1={$key['id_beli_barang']}&aksi=hapus' class='btn btn-danger btn-sm'><i class='fas fa-times'></i></a>
                  </td>
              </tr>
          ";
          $total+=$key['jumlah'];
      }
      $hasil="
      <table class='table table-bordered mt-3'>
          <thead>
              <tr>
                  <th class='text-center' style='width:5%'>No</th>
                  <th class='text-center' style='width:15%'>Kode</th>
                  <th class='text-center'>Nama Barang</th>
                  <th class='text-center' style='width:10%'>Qty</th>
                  <th class='text-center' style='width:15%'>Harga</th>
                  <th class='text-center' style='width:15%'>Jumlah</th>
                  <th class='text-center' style='width:10%'>Aksi</th>
              </tr>
          </thead>
          <tbody>
              $data
              <tr>
                  <th class='text-center'></th>
                  <th class='text-center font-weight-bold' colspan='4'>TOTAL</th>
                  <th class='text-right font-weight-bold'>".rupiah($total)."</th>
              </tr>
          </tbody>
      </table>
      ";
  }
  
  
  $qbarang=AmbilDataAll("barang","");
  foreach ($qbarang as $arbarang) 
  {
      $listbarang.="
          <option value='{$arbarang['id_barang']}'> {$arbarang['barcode']} | {$arbarang['nama']} </option>
      ";
  }
  
  //Supplier
  $qsup=AmbilDataAll("supplier","");
  foreach ($qsup as $arsup) 
  {
      if($a2==$arsup['id_supplier'])
      {
          $listsup.="
              <option value='{$arsup['id_supplier']}' selected> {$arsup['nama']} </option>
          ";
      }
      else
      {
          $listsup.="
              <option value='{$arsup['id_supplier']}'> {$arsup['nama']} </option>
          ";
      }
      
  }
  
  
  if($id!="")
  {
          $TTambahan="    
              <input type='submit' name='tombol' value='Tambah' class='btn btn-primary btn-md'>
              <input type='submit' name='tombol' value='Selesai' class='btn btn-warning btn-md'>
          ";
  
          $FTambahan="
              <div class='form-group row'>
                  <label class='col-sm-2 col-form-label'>Barang</label>
                  <div class='col-sm-6'>
                      <select class='form-control select2' name='a3'>
                          <option value=''> - - Pilih - - </option>
                          $listbarang
                      </select>
                  </div>
              </div>
              <div class='form-group row'>
                  <label class='col-sm-2 col-form-label'>Harga</label>
                  <div class='input-group col-sm-5'>
                      <div class='input-group-prepend'>
                          <span class='input-group-text' id='basic-addon1'>Rp</span>
                      </div>
                      <input type='text' class='form-control' name='a4'>
  
                  </div>
              </div>
              <div class='form-group row'>
                  <label class='col-sm-2 col-form-label'>Jumlah</label>
                  <div class='col-sm-2'>
                      <input type='text' class='form-control' name='a5'>
                  </div>
              </div>
          ";
  
      
      $disabled="disabled";
          
  }
  else
  {
      $TTambahan="
          <input type='submit' name='tombol' value='Baru' class='btn btn-success btn-md'>
      ";
  }
  $konten   = "
   <div class='d-sm-flex align-items-center justify-content-between mb-4'>
           <h3 class='mb-0 text-gray-800'><i class='fas fa-money-bill-wave'></i>    Pembeli Tambah</h3>
            <div class='d-flex flex-row-reverse'>
            
            <a href='?page=gudang/pembeli_list' class='d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm mr-2'><i class='fas fa-arrow-left'></i></a>
        </div>
        </div>
      <form method='post' autocomplete='off'>
          <div class='form-group row'>
              <label class='col-sm-2 col-form-label'>Kode</label>
              <div class='col-sm-4'>
                  <input type='text' class='form-control' name='a1' value='$a1' readonly>
              </div>
          </div>
          <div class='form-group row'>
              <label class='col-sm-2 col-form-label'>Supplier</label>
              <div class='col-sm-6'>
                  <select class='form-control select2' name='a2' value='$a2' $disabled>
                      <option value=''> - - Pilih - - </option>
                      $listsup
                  </select>
              </div>
          </div>
          $FTambahan
          $TTambahan
      </form>
  
      $hasil
  ";
?>