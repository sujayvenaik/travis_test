<?php
$client = new http\Client;
$request = new http\Client\Request;
$body = new http\Message\Body;
$body->append(
"<xml>\n\tdata is data\n</xml>"
);
$request->setBody($body);
$request->setRequestUrl('https://postman-echo.com/post');
$request->setRequestMethod('POST');
$request->setHeaders(array(
    'Content-Type' => 'application/xml',
));
$client->enqueue($request)->send();
$response = $client->getResponse();

echo $response->getBody();
?>