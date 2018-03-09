<?php

require "config.php";

if (isset($_POST['submit'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    try {
        $connection = new PDO("mysql:host=$config_db_host", $username, $password, $config_db_options);
        $db_list = $connection->query( 'SHOW DATABASES' );

        while ( ( $db = $db_list->fetchColumn( 0 ) ) !== false ) {
            echo $db . '<br>';
        }
    }

    catch(PDOException $error) {
        echo 'CONNECTION ERROR HAS OCCURED' . $error->getMessage();
    }
}

?>
