<?php

$client = new http\Client;

$request = new http\Client\Request;
$body = new http\Message\Body;
$body->addForm(array(
  '1' => 'ws',
  's' => 'a',
  'wq' => 'qqqq'
), NULL);
$request->setBody($body);
$request->setRequestUrl('https://postman-echo.com/post');
$request->setRequestMethod('POST');


$request->setHeaders(array(
  'Content-Type' => 'text/plain'
));

$client->enqueue($request)->send();
$response = $client->getResponse();

echo $response->getBody();