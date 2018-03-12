<?php
while ( ( $db = $db_list->fetchColumn( 0 ) ) !== false ) {
        echo $db . '<br>';
    }
?>