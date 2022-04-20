<?php
	$page =$_GET['page'];
	if($_SESSION['id']=="")
	{
		include("pages/login.php");
	}
	else
	{
	  if (!file_exists("pages/$page.php")) 
	  {
	  	header("location:index.php?page=home");
		}
		else
		{
			include("pages/$page.php");
		}
	}
	include("template/$template.php");
  
?>