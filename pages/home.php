<?php	
    
    $nama=Pengguna($_SESSION['id'])['nama'];

	$template = "dashboard";
    $judul = "Home";
    $active="active";
    $konten = "
            <!-- Page Heading -->
            <h1 class='text-gray-800'>Selamat Datang $nama </h1>

            <div class='row'>
                <!-- nama Toko -->
                <div class='col-xl-3 col-md-6 mb-4'>
                    <div class='card border-left-primary shadow h-100 py-2'>
                        <div class='card-body'>
                            <div class='row no-gutters align-items-center'>
                                <div class='col mr-2'>
                                    <div class='text-xs font-weight-bold text-primary text-uppercase mb-1'>
                                    Nama Minimart</div>
                                    <div class='h6 mb-0 font-weight-bold text-gray-800'>JYP Shop</div>
                                </div>
                                <div class='col-auto'>
                                    <a class='btn btn-primary'>
                                    <i class='fas fa-store-alt fa-2x'></i>
                                    </a>
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>

                <!-- Nama Pemilik-->
                <div class='col-xl-3 col-md-6 mb-4'>
                    <div class='card border-left-success shadow h-100 py-2'>
                        <div class='card-body'>
                            <div class='row no-gutters align-items-center'>
                                <div class='col mr-2'>
                                    <div class='text-xs font-weight-bold text-success text-uppercase mb-1'>
                                    Pemilik</div>
                                    <div class='h6 mb-0 font-weight-bold text-gray-800'>Dimas Triana</div>
                                </div>
                                <div class='col-auto'>
                                    <a class='btn btn-success'>
                                        <i class='fas fa-user fa-2x'></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Jumlah Kariyawan -->
                <div class='col-xl-3 col-md-6 mb-4'>
                    <div class='card border-left-warning shadow h-100 py-2'>
                        <div class='card-body'>
                            <div class='row no-gutters align-items-center'>
                                <div class='col mr-2'>
                                    <div class='text-xs font-weight-bold text-warning text-uppercase mb-1'>
                                        Jumlah Kariyawan</div>
                                    <div class='h5 mb-0 font-weight-bold text-gray-800'>20</div>
                                </div>
                                <div class='col-auto'>
                                <a class='btn btn-warning'>
                                    <i class='fas fa-users fa-2x'></i>
                                </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    ";

?>