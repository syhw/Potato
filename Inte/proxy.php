<?php

$url = $_REQUEST['url'];
$token = $_REQUEST['token'];

// create a new cURL resource
$ch = curl_init();

// set URL and other appropriate options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: AuthSub token="' . $token . '"', 'GData-Version : 3'));

// grab URL and pass it to the browser
//header('Content-type: image/jpeg');
curl_exec($ch);

// close cURL resource, and free up system resources
curl_close($ch);

?>