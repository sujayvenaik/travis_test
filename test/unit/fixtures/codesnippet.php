<?php

$client = new http\Client;
$request = new http\Client\Request;

$body = new http\Message\Body;
$body->addForm(array(
  '1' => 'ws',
  's' => 'a',
  'wq' => 'qqqq'
), NULL);
$headers = NULL;  
$request = new http\Client\Request('POST', 'https://postman-echo.com/post', null, $body);

$client->enqueue($request)->send();
$response = $client->getResponse();

echo $response->getBody();
?>
// $msg = new http\Message\Body();
// $msg->addForm([
//   'field1' => 'value',
//   'field2' => 'value2'
// ]);

// $headers = null;


// $client = new http\Client();
// $client->enqueue($request);
// $client->send();

// $response = $client->getResponse();