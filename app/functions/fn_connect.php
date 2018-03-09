<?php
	print_r($_REQUEST);
	$username = $_REQUEST["username"];
	$password = $_REQUEST["password"];
	$connection = new PDO("mysql:host=$config_db_host", $username, $password, $config_db_options);
	echo 'connected';
?>