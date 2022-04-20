<?php

//Fungsi untuk login
function Login($username="",$password="")
    {
        global $koneksi;
        $status="1";
       
        $Query=mysqli_query($koneksi,"SELECT * FROM pengguna WHERE md5(username)=md5('$username') AND password=md5('$password') AND status='$status'");

        if(mysqli_num_rows($Query))
        {
            $data=mysqli_fetch_assoc($Query);

            $_SESSION['id']=$data['id_pengguna'];
            $_SESSION['jenis_log']=$data['level'];
            header("location:index.php");
        }
        else
        {
            return Alert("info","Maaf Login gagal","Periksa kembali inputan");
        }

    }
//fungsi untuk data pengguna

function Pengguna($kunci)
    {
        global $koneksi;

        $Query=mysqli_query($koneksi,"select * from pengguna where id_pengguna='$kunci'");
        return mysqli_fetch_assoc($Query);
       
    }


//funsi untuk menampilkan level pengguna
function Level($data)
    {
        switch($data)
        {
            case "1":return "Pemilik";break;
            case "2":return "Bag. Gudang";break;
            case "3":return "Kasir";break;
        }
    }

//funsi untuk menampilkan level pengguna
function status($status)
    {
        switch($status)
        {
            case "0":return "<span class='btn btn-dark btn-sm rounded-pill'>Tidak Aktif</span>";break;
            case "1":return "<span class='btn btn-success btn-sm rounded-pill'>Aktif</span>";break;
            
        }
    }
     
   
//fungsi untuk sweetalert2 sederhana
function Alert($jenis="",$peringatan="",$keterangan="")
    {
        return "
            <script>
                Swal.fire(
                    '".$peringatan."',
                    '".$keterangan."',
                    '".$jenis."'
                )
            </script>
        ";
    }
    
function towewengkonfirm($linkdirect)
    {
        return "
        <script>
            Swal.fire({
                title: 'Yakin data akan dihapus?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yakin'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '".$linkdirect."';
                }
            })
        </script>
        ";
    }

function ResetPengguna($a3,$kunci)
    {
        global $koneksi;

        $q="update pengguna set password=md5('$a3') where id_pengguna='$kunci'";
        $hasil=mysqli_query($koneksi,$q);
        if($hasil)
        {
            $keterangan=Alert("success","Data berhasil disimpan","");
        }
        else
        {
            $keterangan=Alert("error","Data gagal disimpan","");
        }
        return $keterangan;

    }

    function accespemilik()
    {
        if ($_SESSION['jenis_log']!="1")
        {
           header("location:index.php?page=home");
        }
    }

    function accesgudang()
    {
        if ($_SESSION['jenis_log']!="2")
        {
           header("location:index.php?page=home");
        }
    }

    function acceskasir()
    {
        if ($_SESSION['jenis_log']!="3")
        {
           header("location:index.php?page=home");
        }
    }

//QUERY Tambah
    function Tambah($tabel,$field,$value)
    {
        global $koneksi;

        $q="
            INSERT INTO $tabel 
            ($field) 
            VALUES ($value)
        ";

        $hasil=mysqli_query($koneksi,$q);
        if($hasil)
        {
            $keterangan=Alert("success","Data berhasil disimpan","");
        }
        else
        {
            $keterangan=Alert("error","Data gagal disimpan","");
        }

        return $keterangan;
    }

    //Query Edit/UPDATE
    function Edit($tabel,$field,$kunci)
    {
        global $koneksi;

        $q="UPDATE $tabel SET $field where $kunci";
        $hasil=mysqli_query($koneksi,$q);
        if($hasil)
        {
            $keterangan=Alert("success","Data berhasil disimpan","");
        }
        else
        {
            $keterangan=Alert("error","Data gagal disimpan","");
        }

        return $keterangan;
    }

    function AmbilData($tabel,$kunci)
    {
        global $koneksi;
        $query="select * from $tabel where $kunci";
        $query=mysqli_query($koneksi,$query);
        return mysqli_fetch_assoc($query);
    }

    function AmbilDataAll($tabel,$lain)
    {
        global $koneksi;
        $query="select * from $tabel $lain";
        return mysqli_query($koneksi,$query);
    }

    function AmbilDatatrans($field,$tabel,$lain)
    {
        global $koneksi;
        $query="select * $field from $tabel $lain";
        return mysqli_query($koneksi,$query);
    }

    function Hapus($tabel,$kunci)
    {
        global $koneksi;
        $q="DELETE FROM $tabel where $kunci";
        return mysqli_query($koneksi,$q);
    }


    function TambahTrans($tabel,$field,$value)
    {
        global $koneksi;

        $q="
            INSERT INTO $tabel 
            ($field) 
            VALUES ($value)
        ";

        return mysqli_query($koneksi,$q);
    }
    
    function rupiah($angka)
    {
        return number_format($angka,0,',','.');
    }

?>