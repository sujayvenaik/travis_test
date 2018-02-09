<?php
$request = new HttpRequest();
$request->setUrl('https://postman-echo.com/post');
$request->setMethod(HTTP_METH_POST);
$request->setHeaders(array(
	'Content-Type' => 'text/plain',
	'content-Type' => 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
));
$request->setBody(
'------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"1\"\r\n\r\na\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"2\"\r\n\r\nb\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--'
);

try {
	$response = $request->send();
	echo $response->getBody();
} catch (HttpException $ex) {
	echo $ex; 
}?>