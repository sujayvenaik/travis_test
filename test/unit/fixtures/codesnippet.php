<?php
$client = new http\Client;
$request = new http\Client\Request;
$request->setRequestUrl('https://postman-echo.com/headers');
$request->setRequestMethod('GET');
$request->setHeaders(array(
        'my-sample-header'=> 'Lorem ipsum dolor sit amet',
        'testing'=> '\'singlequotes\'',
        'test'=> '"doublequotes"'
    
));
$client->enqueue($request)->send();
$response = $client->getResponse();
echo $response->getBody();
?>