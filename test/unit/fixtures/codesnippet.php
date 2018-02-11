<?php

$client = new http\Client;
$request = new http\Client\Request;

$body = new http\Message\Body;
$body->addForm(array(
  '1' => 'ws',
  's' => 'a',
  'wq' => 'qqqq'
), NULL);
$request->setHeaders(array(
    'Content-Type' => 'text/plain'
  ));
// $request->setBody($body);


$request = new http\Client\Request('POST', 'https://postman-echo.com/post', NULL, $body);

$client->enqueue($request)->send();
$response = $client->getResponse();

echo $response->getBody();