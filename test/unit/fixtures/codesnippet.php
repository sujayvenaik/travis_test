<?php
$client = new http\Client;
$request = new http\Client\Request();
$body = new http\Message\Body;
$body->append(new http\QueryString(array(
'1' => 'a',
'2' => 'b',
'c' => 'c',
)));
$request->setBody($body);
$request->setRequestUrl('https://postman-echo.com/post');
$request->setRequestMethod('POST');
$request->setHeaders(array(
'Content-Type' => 'application/x-www-form-urlencoded',
));
$client->enqueue($request)->send();
$response = $client->getResponse();

echo $response->getBody();
?>