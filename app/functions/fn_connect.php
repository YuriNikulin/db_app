<?php
	session_start();
	$username = $_REQUEST["username"];
	$password = $_REQUEST["password"];
	try {
		$connection = new PDO("mysql:host=$config_db_host", $username, $password, $config_db_options);
		$answer = array(
			"success" => 1,
			"msg" => 'You have been successfully connected to server as ' . $username
		);

		$_SESSION["username"] = $username;
		$_SESSION["password"] = $password;
	}
	catch(PDOException $error) {
		$answer = array(
			"success" => 0,
			"timer" => 10000,
			"msg" => 'You couldn\'t connect to server, error text: ' . $error->getMessage()
		);
	}

	echo json_encode($answer);
?>