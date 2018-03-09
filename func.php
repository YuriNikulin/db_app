<?php

require "config.php";

$script = $config_functions . $_REQUEST["script"];

require $script;

?>
