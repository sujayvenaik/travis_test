<?php
$client = new http\Client;
$request = new http\Client\Request;
$body = new http\Message\Body;
$body->addForm(array(
    'fdjks' => 'dsf',

), NULL);
$request->setBody($body);
$request->setRequestUrl('https://postman-echo.com/post');
$request->setRequestMethod('POST');
$request->setHeaders(array(
));
$client->enqueue($request)->send();
$response = $client->getResponse();

echo $response->getBody();
?>
