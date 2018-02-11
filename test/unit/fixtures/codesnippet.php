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
$request->setRequestUrl('');
$request->setRequestMethod('POST');


$headers = (array(
  'Content-Type' => 'text/plain'
));
$request = new http\Client\Request('POST', 'https://postman-echo.com/post',$headers, $body);

$client->enqueue($request)->send();
$response = $client->getResponse();

echo $response->getBody();