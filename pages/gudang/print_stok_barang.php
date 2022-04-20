 <?php  
    accesgudang();
    $template = "print";
    $judul = "Barang List";

    $nama=Pengguna($_SESSION['id'])['nama'];        
    $query_select="SELECT * FROM barang ";
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
      <CENTER>
        <strong>
          Laporang Stok Barang<br>
          Per ".date("d-m-Y")."
        </strong>
      </CENTER>
         
      <table class='table table-bordered mt-5'>
            <thead>
                <tr>
                    <th class='text-center' style='width:5%'>No</th>
                    <th class='text-center' style='width:15%'>Kode</th>
                    <th class='text-center' style='width:15%'>Nama</th>
                    <th class='text-center' style='width:30%'>Harga</th>
                    <th class='text-center' style='width:15%'>Stok</th>
                </tr>
            </thead>
            <tbody>
                    $t
            </tbody>
        </table>
          <div style='margin-top:2em;float:right'>
            Subang, ".date("d-m-Y")." <br>
            Bagian Gudang
            <p style='margin-top:5em;'>
              $nama
            </p>
          </div>
  ";
?>