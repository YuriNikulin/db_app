<?php
	session_start();
	if (!empty($_SESSION["username"]) && !empty($_SESSION["password"])) {
		$db_list_fetch = array();
		$username = $_SESSION["username"];
		$password = $_SESSION["password"];

		$connection = new PDO("mysql:host=$config_db_host", $username, $password, $config_db_options);
		$db_list = $connection->query( 'SHOW DATABASES' );

		while ( ( $db = $db_list->fetchColumn( 0 ) ) !== false ) {
			array_push($db_list_fetch, $db);
		}

		$answer = array(
			'success' => 1,
			'db_list' => $db_list_fetch
		);

	}  else {
		$answer = array(
			'success' => 0,
			'msg' => 'Couldnt load the list of databases'
		);
	}

	echo json_encode($answer);

?>