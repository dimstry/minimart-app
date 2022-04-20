<?php
	$menu_sidebar="
	 <!-- Sidebar -->
        <ul class='navbar-nav bg-gradient-danger sidebar sidebar-dark accordion' id='accordionSidebar'>

            <!-- Sidebar - Brand -->
            <a class='sidebar-brand d-flex align-items-center justify-content-center'>
                <div class='sidebar-brand-icon'>
                    <i class='fas fa-user'></i>
                </div>

                <div class='sidebar-brand-text mx-3'>Kasir</div>
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
                <a class='nav-link' href='?page=kasir/penjual_list'>
                    <i class='fas fa-shopping-bag'></i>
                    <span>Penjual</span></a>
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