<?php
$client = new http\Client;
$request = new http\Client\Request;
$body = new http\Message\Body;
$body->addForm(array(
    '1' => '\'a\'',
    '2' => '"b"',
    '\'3\'' => 'c',
    '"4"' => 'd',
    'Special' => '!@#$%&*()^_+=`~'
), null);

$request->setBody($body);
$request->setRequestUrl('https://postman-echo.com/post');
$request->setRequestMethod('POST');
$request->setHeaders(array(
        'Content-Type'=> 'multipart/form-data'
));
$client->enqueue($request)->send();
$response = $client->getResponse();
echo $response->getBody();
?>