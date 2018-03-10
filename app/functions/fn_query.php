<?php
	session_start();
	$username = $_SESSION["username"];
	$password = $_SESSION["password"];
	$sql = $_REQUEST["sql"];
	$connection = new PDO("mysql:host=$config_db_host", $username, $password, $config_db_options);

	try {
		$query = $connection->query($sql);

		$answer = array(
			'success' => 1,
			'msg' => $query->fetchAll(PDO::FETCH_COLUMN)
		);
	}  
	catch(PDOException $error) {
		$answer = array(
			'success' => 0,
			'msg' => 'Couldnt load tables'
		);
	}
	

	echo json_encode($answer);
?>