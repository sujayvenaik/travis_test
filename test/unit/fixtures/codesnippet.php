<?php
$req = new HTTP_Request2('https://postman-echo.com/headers');
$req->setMethod('POST');
$req->setHeaders(array(
    'my-sample-header' => 'Lorem ipsum dolor sit amet'
  ));
$req->setBody('');
$response = $req->send();
echo $response;
?>

