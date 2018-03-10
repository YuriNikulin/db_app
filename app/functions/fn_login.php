<?php 
	session_start();

	if (isset ($_SESSION["username"]) && isset ($_SESSION["password"])) {
		$answer = array(
			'success' => 1
		);
	} else {
		$answer = array(
			'success' => 0
		);
	}

	echo json_encode($answer);
?>