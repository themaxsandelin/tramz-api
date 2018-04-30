<?php

/**
 * Set default time zone to Stockholm (+02:00)
 */
date_default_timezone_set('Europe/Stockholm');

/**
 * A simple parser for the .env config file that sets up constants for each key->value property
 */
$envString = file_get_contents('.env');
$lines = preg_split('/$\R?^/m', $envString);
foreach ($lines as $line) {
  $prop = explode('=', $line);
  define($prop[0], $prop[1]);
}

$req = curl_init();
curl_setopt($req, CURLOPT_URL, 'https://api.vasttrafik.se:443/token');
curl_setopt($req, CURLOPT_POST, true);
curl_setopt($req, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
curl_setopt($req, CURLOPT_USERPWD, KEY . ':' . SECRET);
curl_setopt($req, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($req);
if (!$res) {
  echo json_encode([
    'error' => 'Failed to fetch token.'
  ]);
  exit;
}
$res = json_decode($res, true);

header('Content-Type: application/json');
echo json_encode([
  'token' => $res['access_token'],
  'expires' => intval(time() + $res['expires_in'])
]);