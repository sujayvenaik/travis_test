<?php

$client = new http\Client;
$request = new http\Client\Request;

$request->setRequestUrl('https://www.google.com');
$request->setRequestMethod('GET');
$request->setHeaders(array(
  'TEST' => '\\"doublequotes\\"',
  'testing' => ''singlequotes'',
  'my-sample-header' => 'Lorem ipsum dolor sit amet'
));

$client->enqueue($request)->send();
$response = $client->getResponse();

echo $response->getBody();