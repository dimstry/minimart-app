<?php
	echo "
  <!doctype html>
  <html lang='en'>
  <head>
    <title>$judul</title>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
    <link rel='icon' type='image/x-icon' href='assets/dashboard/img/1.gif'>
    <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap' rel='stylesheet'>
    <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'>
    <link rel='stylesheet' href='assets/login/css/style.css'>

    </head>
    <body class='img js-fullheight' style='background-image: url(assets/login/img/bg.jpg); background-position:fixed;'>
       $konten
      <script src='//cdn.jsdelivr.net/npm/sweetalert2@11'></script>
       $alert
      <script src='assets/login/js/jquery.min.js'></script>
      <script src='assets/login/js/popper.js'></script>
      <script src='assets/login/js/bootstrap.min.js'></script>
      <script src='assets/login/js/main.js'></script>

    </body>
  </html>
	";
?>