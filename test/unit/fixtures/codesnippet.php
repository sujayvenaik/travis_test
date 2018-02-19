<?php
$client = new http\Client;
$request = new http\Client\Request;
$request->setRequestUrl('https://9c76407d-5b8d-4b22-99fb-8c47a85d9848.mock.pstmn.io');
$request->setRequestMethod('PURGE');
$client->enqueue($request)->send();
$response = $client->getResponse();
echo $response->getBody();
?>