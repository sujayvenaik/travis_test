<?php
$request = new HttpRequest();
$request->setUrl('https://postman-echo.com/headers');
$request->setMethod(HTTP_METH_GET);
$request->setHeaders(array(
    'my-sample-header' => 'Lorem ipsum dolor sit amet',
));

try {
    $response = $request->send();
    echo $response->getBody();
} catch (HttpException $ex) {
    echo $ex; 
}?>
