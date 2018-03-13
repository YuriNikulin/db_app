<?php
	session_start();
	$username = $_SESSION["username"];
	$password = $_SESSION["password"];
	$mode = $_REQUEST["mode"];
	$dsn = "mysql:host=$config_db_host";

	if (isset($_REQUEST["use"]) && $_REQUEST["use"] != "undefined") {
		$_SESSION["use"] = $_REQUEST["use"];
	}

	if (isset ($_SESSION["use"])) {
		$dsn .= ';dbname=' . $_SESSION["use"];
	}

	$sql = $_REQUEST["sql"];
	$pdo = new PDO($dsn, $username, $password, $config_db_options);

	try {
		$stmt = $pdo->prepare($sql);
		$stmt->execute();

		if ($mode == 'read') {
			$answer = array(
				'success' => 1,
				'msg' => $stmt->fetchAll(PDO::FETCH_ASSOC)
			);

		} else {
			$answer = array(
				'success' => 1,
				'msg' => $stmt
			);
		}
	}
	catch(PDOException $error) {
		$answer = array(
			'success' => 0,
			'msg' => 'SQL error: ' . $error->getMessage()
		);
	}
	echo json_encode($answer);
?>