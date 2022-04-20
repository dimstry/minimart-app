 <?php  
    accesgudang();
    $template = "dashboard";
    $judul = "Barang List";
    $active1="active";
    
    $id=$_GET['id'];

        
    $query_select="SELECT * FROM barang";
    $tampil=mysqli_query($koneksi,$query_select);
    foreach ($tampil as $key )
    {
      $nomor++;
      $t.="
         <tbody>
          <tr>
              <td>$nomor</td>
              <td>{$key['barcode']}</td>
              <td>{$key['nama']}</td>
              <td>".rupiah($key['harga'])."</td>
              <td>{$key['stok']}</td>
          </tr>
      </tbody>
      ";
    }
    
    $konten = "
        <div class='d-sm-flex align-items-center justify-content-between mb-4'>
             <h3 class='mb-0 text-gray-800'><i class='fas fa-box-open'></i>    Barang</h3>
            <div class='d-flex flex-row-reverse'>
              
              <a href='?page=gudang/print_stok_barang' class='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm' target='_blank'><i class='fas fa-print'></i></a>
              <a href='?page=gudang/barang_list' class='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-2'><i class='fas fa-arrow-left'></i></a>
            </div>
        </div>
         
      <table class='table table-bordered'>
            <thead>
                <tr>
                    <th class='text-center' style='width:5%'>No</th>
                    <th class='text-center' style='width:15%'>Kode</th>
                    <th class='text-center' style='width:15%'>Nama</th>
                    <th class='text-center' style='width:30%'>Harga</th>
                    <th class='text-center' style='width:15%'>Jumlah</th>
                </tr>
            </thead>
            <tbody>
                    $t
               </tbody>
        </table>
  ";
?>