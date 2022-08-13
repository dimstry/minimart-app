 <?php  
    accesgudang();

    $template = "dashboard";
    $judul = "Pembeli";
    $active3="active";
    $id=$_GET['id'];
    $tgl=$_GET['tgl'];
    $a1=$_GET['a1'];
    
    $tombol=$_POST['tombol'];
    $a1=$_POST['a1'];
    $tabel="pembelian_list";

    if($tombol)
    {
        header("location:?page=$page&tgl=$a1");
    }

    if($tgl!="")
    {
        $lain="WHERE DATE(waktu)='$tgl'";
        $q=AmbilDataAll($tabel,$lain);
        $total=0;
        foreach($q as $ar)
        {
            $no++;
            $data.="
                <tr>
                    <td class='text-center'>$no</td>
                    <td class='text-center'>{$ar['kode']}</td>
                    <td class='text-center'>{$ar['waktu']}</td>
                    <td class='text-left'>{$ar['nama']}</td>
                    <td class='text-right'>".rupiah($ar['total'])."</td>
                    <td class='text-center'>
                     <a href='?page=gudang/pembeli_edit&id={$ar['id_pembelian']}' class='btn btn-success btn-sm'><i class='fas fa-edit'></i></a>
                    <a href='?page=$page&id={$ar['id_pembelian']}&p=tanya&tgl=$tgl' class='btn btn-danger btn-sm'><i class='fas fa-times'></i></a>    
                    </td>
                </tr>
            ";
            $total+=$ar['total'];
        }

    $hasil="
        <table class='table table-bordered'>
            <thead>
                <tr>
                    <th class='text-center' style='width:5%'>No</th>
                    <th class='text-center' style='width:15%'>Kode</th>
                    <th class='text-center' style='width:15%'>Waktu</th>
                    <th class='text-center' style='width:30%'>Supplier</th>
                    <th class='text-center' style='width:15%'>Jumlah</th>
                    <th class='text-center' style='width:10%'>Aksi</th>
                </tr>
            </thead>
            <tbody>
                $data
                <tr>
                    <th class='text-center'></th>
                    <th class='text-center font-weight-bold' colspan='3'>TOTAL</th>
                    <th class='text-right font-weight-bold'>".rupiah($total)."</th>
                    <th class='text-center'></th>
                </tr>
            </tbody>
        </table>
    ";
}

$konten   = "

    <div class='d-sm-flex align-items-center justify-content-between mb-4'>
       <h3 class='mb-0 text-gray-800'><i class='fas  fa-money-bill-wave'></i>    Pembeli List</h3>
        <div class='d-flex flex-row-reverse'>
        
        <a href='?page=gudang/pembeli_tambah' class='d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-2'><i class='fas fa-plus'></i></a>
    </div>
    </div>
    <form method='post' autocomplete='off' action='?page=$page'>
        <div class='form-group row'>
            <label class='col-sm-1 col-form-label'>Tanggal</label>
            <div class='col-sm-3'>
                <input type='text' class='form-control' name='a1' value='$a1' placeholder='yyyy-mm-dd'>
            </div>
            <div class='col-sm-4'>
            <input type='submit' name='tombol' value='Lihat' class='btn btn-primary btn-md'>
            </div>
        </div>
    </form>

    $hasil
    
";

$p=$_GET['p'];
switch($p)
{
    case "tanya":
        $alert=towewengkonfirm("?page=gudang/pembeli_hapus&id=$id&tgl=$tgl");
    break;
}

$h=$_GET['h'];
switch($h)
{
    case "true":
        $alert=Alert("success","Data telah dihapus");
    break;
    case "false":
        $alert=Alert("info","Maaf Data tidak dapat dihapus");
    break;
}
?>