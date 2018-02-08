<?php
include_once('http.php');
$request = new HttpRequest();
$request->setUrl('https://postman-echo.com/post?pm=0&postman=1');
$request->setMethod(HTTP_METH_POST);
$request->setHeaders(array(
	'1' => 'a',
	'2' => 'b',
));

try {
	$response = $request->send();
	echo $response->getBody();
} catch (HttpException $ex) {
	echo $ex; 
}?>