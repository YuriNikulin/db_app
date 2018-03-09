<?php
	$config_db_host = 'localhost';
	$config_db_options    = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
              );

	$config_functions = 'app/functions/fn_';

	ini_set('display_errors', '1');
    ini_set('error_reporting', E_ALL);
?>