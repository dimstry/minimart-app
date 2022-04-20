<?php
 
     $menu_sidebar="
<!-- Sidebar -->
        <ul class='navbar-nav bg-gradient-primary sidebar sidebar-dark accordion' id='accordionSidebar'>

            <!-- Sidebar - Brand -->
            <a class='sidebar-brand d-flex align-items-center justify-content-center'>
                <div class='sidebar-brand-icon'>
                    <i class='fas fa-user'></i>
                </div>

                <div class='sidebar-brand-text mx-3'>Pemilik</div>
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
                <a class='nav-link' href='?page=pemilik/pengguna_list'>
                    <i class='fas fa-users'></i>
                    <span>Pengguna</span></a>
            </li>

            <!-- Nav Item - Laporan Pembeli -->
            <li class='nav-item $active2'>
                <a class='nav-link' href='?page=pemilik/lap_pembeli'>
                    <i class='fas fa-tag'></i>
                    <span>LAP.Pembeli</span></a>
            </li>

            <!-- Nav Item - Laporan Penjual -->
            <li class='nav-item $active3'>
                <a class='nav-link' href='?page=pemilik/lap_penjual'>
                    <i class='fas fa-tags'></i>
                    <span>LAP.Penjual</span></a>
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