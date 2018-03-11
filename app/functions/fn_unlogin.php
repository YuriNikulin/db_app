<?php 
	session_start();
	$_SESSION = array();
	session_destroy();
	$answer = array(
		'success' => 1
	);

	echo json_encode($answer);
?>