<?php
	$menu_sidebar="
	 <!-- Sidebar -->
        <ul class='navbar-nav bg-gradient-success sidebar sidebar-dark accordion' id='accordionSidebar'>

            <!-- Sidebar - Brand -->
            <a class='sidebar-brand d-flex align-items-center justify-content-center'>
                <div class='sidebar-brand-icon'>
                    <i class='fas fa-user'></i>
                </div>

                <div class='sidebar-brand-text mx-3'>Gudang</div>
            </a>

            <!-- Divider -->
            <hr class='sidebar-divider my-0'>

            <!-- Nav Item - Dashboard -->
            <li class='nav-item $active'>
                <a class='nav-link' href='?page=home'>
                    <i class='fas fa-home'></i>
                    <span>Dashboard</span></a>
            </li>

            <!-- Nav Item - Pengguna -->
            <li class='nav-item $active1'>
                <a class='nav-link' href='?page=gudang/barang_list'>
                    <i class='fas fa-box-open'></i>
                    <span>Barang</span></a>
            </li>

            <!-- Nav Item - Laporan Pembeli -->
            <li class='nav-item $active2'>
                <a class='nav-link' href='?page=gudang/supplier_list'>
                    <i class='fas fa-store-alt'></i>
                    <span>SUPPLIER</span></a>
            </li>

            <!-- Nav Item - Laporan Penjual -->
            <li class='nav-item $active3'>
                <a class='nav-link' href='?page=gudang/pembeli_list'>
                    <i class='fas fa-money-bill-wave'></i>
                    <span>Pembelian</span></a>
            </li>

            <!-- Divider -->
            <hr class='sidebar-divider d-none d-md-block'>

            <!-- Sidebar Toggler (Sidebar) -->
            <div class='text-center d-none d-md-inline'>
                <button class='rounded-circle border-0' id='sidebarToggle'></button>
            </div>

        </ul>
        <!-- End of Sidebar -->


	";
?>