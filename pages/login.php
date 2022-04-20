 <?php
   	$username=$_POST['username'];
    $password=$_POST['pass'];
    $tombol=$_POST['tombol'];

    if ($tombol)
    {
    	$alert=Login($username,$password);
    }
    if ($_SESSION['id']) {
        header('Location:index.php');
    }
  
  	$template = "depan";
    $judul = "login";
    $konten = "
	<section class='ftco-section'>
		<div class='container'>
			<div class='row justify-content-center'>
				<div class='col-md-6 text-center mb-5'>
					<h2 class='heading-section'>Selamat Datang</h2>
				</div>
			</div>
			<div class='row justify-content-center'>
				<div class='col-md-6 col-lg-4'>
					<div class='login-wrap p-0'>
						<form action='' class='signin-form' method='POST' autocomplete='off'>
							<div class='form-group'>
								<input type='text' class='form-control' placeholder='Username' name='username' autofocus>
							</div>
							<div class='form-group'>
								<input id='password-field' type='password' class='form-control' placeholder='Password' name='pass'>
								<span toggle='#password-field' class='fa fa-fw fa-eye field-icon toggle-password'></span>
							</div> 
							<div class='form-group'>
								<input type='submit' class='form-control btn btn-primary submit px-3' value='Masuk' name='tombol'>
							</div>     
						</form>
					</div>
				</div>
			</div>
		</div>
	</section>

	
";
?>
