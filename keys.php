<?php

$type = $_GET['key'];
if (!$type || ($type !== 'plan' && $type !== 'list')) {
  header('Location: /404');
  die();
}

/**
 * A simple parser for the .env config file that sets up constants for each key->value property
 */
$envString = file_get_contents('.env');
$lines = preg_split('/$\R?^/m', $envString);
foreach ($lines as $line) {
  $prop = explode('=', $line);
  define($prop[0], $prop[1]);
}

$key = constant(($type === 'plan') ? 'PLANKEY':'LISTKEY');
header('Content-Type: application/json');
echo json_encode([
  'key' => $key
]);