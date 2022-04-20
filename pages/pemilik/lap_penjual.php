<?php  
    accespemilik();
    $template = "dashboard";
    $judul = "Lap.Penjual";
    $active3="active";

    $id=$_GET['id'];
    $tgl=$_GET['tgl'];
    $tgl1=$_GET['tgl1'];
    
    $tombol=$_POST['tombol'];
    $tabel="penjualan_list";
    $a1=$_POST['a1'];
    $a2=$_POST['a2'];


    if($tombol)
    {
        header("location:?page=$page&tgl=$a1&tgl1=$a2");
    }

    if($tgl!="")
    {
        $lain="WHERE DATE(waktu) BETWEEN '$tgl' AND '$tgl1'";
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
                            <th class='text-center' style='width:30%'>Kasir</th>
                            <th class='text-center' style='width:15%'>Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        $data
                        <tr>
                            <th class='text-center'></th>
                            <th class='text-center font-weight-bold' colspan='3'>TOTAL</th>
                            <th class='text-right font-weight-bold'>".rupiah($total)."</th>
                        </tr>
                    </tbody>
                </table>
            ";
}

$konten   = "

  <div class='d-sm-flex align-items-center justify-content-between mb-4'>
        <h3 class='mb-0 text-gray-800'><i class='fas fa-tags'></i>    Lap.Penjual</h3>
    </div>
    <form method='post' autocomplete='off' action='?page=$page'>
        <div class='form-group row'>
            <label class='col-sm-1 col-form-label'>Tanggal</label>
            <div class='col-sm-2'>
                <input type='date' class='form-control' name='a1' placeholder='yyyy-mm-dd'>
            </div>
            <div class='col-sm-2'>
                <input type='date' class='form-control' name='a2' placeholder='yyyy-mm-dd'>
            </div>
            <div class='col-sm-4'>
            <input type='submit' name='tombol' value='Lihat' class='btn btn-primary btn-md'>
            </div>
        </div>
    </form>

    $hasil
    
";
?>