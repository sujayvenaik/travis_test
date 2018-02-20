<?php

$client = new http\Client;
$request = new http\Client\Request;

$body = new http\Message\Body;
$body->append('Duis posuere augue vel cursus pharetra. In luctus a ex nec pretium. Praesent neque quam, tincidunt nec leo eget, rutrum vehicula magna.
Maecenas consequat elementum elit, id semper sem tristique et. Integer pulvinar enim quis consectetur interdum volutpat.');

$request->setRequestUrl('https://postman-echo.com/post');
$request->setRequestMethod('OPTIONS');
$request->setBody($body);

$request->setHeaders(array(
  'Content-Type' => 'text/plain'
));

$client->enqueue($request)->send();
$response = $client->getResponse();

echo $response->getBody();
echo "PM";