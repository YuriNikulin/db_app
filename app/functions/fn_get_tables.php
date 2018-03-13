<?php
	session_start();
	$username = $_SESSION["username"];
	$password = $_SESSION["password"];
	$dsn = "mysql:host=$config_db_host";

	if (isset($_REQUEST["use"]) && $_REQUEST["use"] != "undefined") {
		$_SESSION["use"] = $_REQUEST["use"];
	}

	if (isset ($_SESSION["use"])) {
		$dsn .= ';dbname=' . $_SESSION["use"];
	}

	$sql = $_REQUEST["sql"];
	$connection = new PDO($dsn, $username, $password, $config_db_options);

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
			'msg' => 'Couldn\'t load tables: ' . $error->getMessage()
		);
	}
	

	echo json_encode($answer);
?>