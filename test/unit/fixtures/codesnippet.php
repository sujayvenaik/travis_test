<?php
$request = new HttpRequest();
$request->setUrl('https://postman-echo.com/post');
$request->setMethod(HTTP_METH_POST);
$request->setHeaders(array(
    'Content-Type' => 'application/x-www-form-urlencoded',
));
$request->setContentType('application/x-www-form-urlencoded');
$request->setPostFields(array(
    '1' => 'a',
    '2' => 'b',
    'c' => 'c',

));

try {
    $response = $request->send();
    echo $response->getBody();
} catch (HttpException $ex) {
    echo $ex; 
}?>
