<?php	
    acceskasir();
	  $template = "dashboard";
    $judul = "Tambah Penjual";
    $active1="active";
    $id=$_GET['id']; //kode penjualan
    $id1=$_GET['id1'];//kode barang jual
    $aksi=$_GET['aksi'];
   
    $a1=$_POST['a1'];
    $a2=$_POST['a2'];
    $a3=$_POST['a3'];
    $tombol=$_POST['tombol'];
    $tabel="penjualan";
    
    switch($tombol)
  {
      case "Baru":
          $field="kode, waktu, id_pengguna";
          $kode=date("YmdHis");
          $waktu=date("Y-m-d H:i:s");
          $value="'$kode','$waktu','{$_SESSION['id']}'";
          Tambah($tabel,$field,$value);
  
          $kunci="kode='$kode'";
          $qbeli=AmbilData($tabel,$kunci);
  
          header("location:?page=$page&id={$qbeli['id_penjualan']}");


      break;
      case "Tambah":
          $qbarang=AmbilData("barang","barcode=$a2");
          $qbarang['harga'];
          $stok=$qbarang['stok'];
          
          if($stok < $a3)
          {
            $alert=Alert($jenis="info",$peringatan="Stok Tidak Cukup",$keterangan="Periksa Kembali Stok");
          }else{
            if($a3=="")
            {
              $a3=1;
            }
            TambahTrans("jual_barang",
            "id_barang,id_penjualan,banyak_jual,harga_jual",
            "'{$qbarang['id_barang']}','$id','$a3','{$qbarang['harga']}'");
            header("location:?page=$page&id=$id");
          
          }     
      break;
      case "Selesai":
          header("location:?page=$page");
      break;
      case "Batal":
        Hapus($tabel,"id_penjualan='$id'");
        header("location:?page=$page");
      break;
      
  }
 
        
  switch($aksi)
  {
      case "hapus":
          Hapus("jual_barang","id_jual_barang='$id1'");
      break;
  }
  
  $qbarang=AmbilDataAll("barang","where stok>0");
  foreach ($qbarang as $arbarang) 
  {
     
          $listbarang.="
              <option value='{$arbarang['id_barang']}'> {$arbarang['barcode']} | {$arbarang['nama']} </option>
          ";
      
      
  }
  switch($aksi)
  {
      case "hapus":
          Hapus("jual_barang","id_jual_barang='$id1'");
      break;
  }
  if($id!="")
  {
      $kunci="id_penjualan='$id'";
      $DataBeli=AmbilData($tabel,$kunci);
      $a1=$DataBeli['kode'];
      $a2=$DataBeli['id_barang'];
  
      $tampil=AmbilDatatrans(",SUM(banyak_jual) AS Qty,SUM(banyak_jual) * harga_jual AS Jumlah1","struk_jual","where id_penjualan='$id' GROUP BY id_barang");
      $total=0;
      foreach ($tampil as $key )
      {
          $number++;
          $data.="
              <tr>
                  <td class='text-center'>$number</td>
                  <td class='text-left'>{$key['barcode']}</td>
                  <td class='text-left'>{$key['nama']}</td>
                  <td class='text-center'>{$key['Qty']}</td>
                  <td class='text-right'>".rupiah($key['harga_jual'])."</td>
                  
                  <td class='text-right'>".rupiah($key['Jumlah1'])."</td>
                  <td class='text-center'>
                       <a href='?page=$page&id=$id&id1={$key['id_jual_barang']}&aksi=hapus' class='btn btn-danger btn-sm'><i class='fas fa-times'></i></a>
                  </td>
              </tr>
          ";
          $total+=$key['Jumlah1'];
      }
      $hasil="
            <div class='card shadow mb-4 mt-4'>
              <div class='card-body'>
                  <div class='table-responsive mt-4'>
                        <table class='table table-bordered text-center' id='datatable' width='100%' cellspacing='0'>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Kode Barang</th>
                                    <th>Nama Barang</th>
                                    <th>Qty</th>
                                    <th>Harga</th>
                                    <th>Jumlah</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>

                            $data
                            <tr>
                              <th class='text-center'></th>
                              <th class='text-center font-weight-bold' colspan='4'>TOTAL</th>
                              <th class='text-right font-weight-bold'>".rupiah($total)."</th>
                              <th class='text-center'></th>
                            </tr>
                          </tbody>
                      </table>
                  </div>
              </div>
            </div>
      ";
  }
    if($id!="")
    {

          $TTambahan="    
             <input type='submit' class='btn btn-primary ml-2' name='tombol' value='Tambah'></input>
             <input type='submit' name='tombol' value='Selesai' class='btn btn-warning btn-md'>
             <input type='submit' name='tombol' value='Batal' class='btn btn-danger btn-md'>
          ";
  
          $FTambahan="
                  <div class='form-group row'>
                        <label class='col-sm-1  col-form-label-sm'>Jumlah</label>
                      <div class='col-sm-4'>
                        <input type='text' class='form-control form-control-sm' name='a3'>
                      </div>
                    </div>
          ";
          
  }
  else
  {
      $TTambahan="
          <input type='submit' name='tombol' value='Baru' class='btn btn-success btn-md'>
      ";
    $disabled="disabled";
  }
    $konten = "
   <div class='d-sm-flex align-items-center justify-content-between mb-4'>
       <h3 class='mb-0 text-gray-800'><i class='fas  fa-shopping-bag'></i>    Penjualan Tambah</h3>
        <div class='d-flex flex-row-reverse'>
        
        <a href='?page=kasir/penjual_list' class='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-2'><i class='fas fa-arrow-left'></i></a>
    </div>
    </div>
	
			  <form action='' method='POST'  autocomplete='off'>
                <div class='form-group row'>
                      <label class='col-sm-1  col-form-label-sm'>Kode</label>
                    <div class='col-sm-5'>
                      <input type='text' class='form-control' name='a1' value='$a1' readonly>
                    </div>
                  </div>
                
        
                    $FTambahan
                  <div class='form-group row'>
                    <label class='col-sm-1  col-form-label-sm'>Barang</label>
                    <div class='col-sm-5'>
                      <input class='form-control' name='a2' $disabled autofocus>
                    </div>
                  </div>
                   $TTambahan
                   
                </form>
            $hasil
    	

";

?>