<?php
$client = new http\Client;
$request = new http\Client\Request;

$request->setRequestUrl('https://mockbin.org/request');
$request->setRequestMethod('VIEW');
$request->setHeaders(array(
        'Content-Type' => 'text/plain'
));
$client->enqueue($request)->send();
$response = $client->getResponse();
echo $response->getBody();
?>