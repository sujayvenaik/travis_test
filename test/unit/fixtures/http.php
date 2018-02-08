
Skip to content

    All gists
    GitHub

    New gist

13

    12

@twslankard twslankard/http.php
Created 7 years ago •
Code
Revisions 1
Stars 13
Forks 12
simple http request example in php
http.php
<?php
/*
 *  simple HttpRequest example using PHP
 *  tom slankard
 */
class HttpRequest {
  public $url = null;
  public $method = 'GET';
  public $body = null;
  public $headers = Array();
  public $allow_redirect = true;
  private $url_info = null;
  private $host_name = null; 
  private $host_ip = null;
  private $response_body = null;
  private $response_headers = Array();
  private $response_code = null;
  private $response_message = null;
  private $port = null;
  private $verbose = true;
  public function __construct($url, $method = 'GET') {
    $this->url = $url;
    $this->method = $method;
    //  parse url
    $this->url_info = parse_url($url);
    $this->host_name = $this->url_info['host'];
    $this->host_ip = gethostbyname($this->host_name);
    //  get port number given the scheme
    if(!isset($this->url_info['port'])) {
      if($this->url_info['scheme'] == "http")
        $this->port = 80;
      else if($this->url_info['scheme'] == "https")
        $this->port = 443;
    } else {
      $this->port = $this->url_info['port'];
    }
    //  add default headers
    $this->headers["Host"] = "$this->host_name";
    $this->headers["Connection"] = "close";
  }
  private function constructRequest() {
    $path = "/";
    if(isset($this->url_info['path']))
      $path = $this->url_info['path'];
    $req = "$this->method $path HTTP/1.1\r\n";
    foreach($this->headers as $header => $value) {
      $req .= "$header: $value\r\n";
    }
  
    return "$req\r\n";
  }
  ///  reads a line from a file
  function readLine($fp)
  {
    $line = "";
    while (!feof($fp)) {
      $line .= fgets($fp, 2048);
      if (substr($line, -1) == "\n") {
        return rtrim($line, "\r\n");
      }
    }
    return $line;
  }
  public function send() {
    $fp = fsockopen($this->host_ip, $this->port);
    //  construct request
    $request = $this->constructRequest();
    //  write request to socket
    fwrite($fp, $request);
    //  read the status line
    $line = $this->readline($fp);
    $status = explode(" ", $line);
    //  make sure the HTTP version is valid
    if(!isset($status[0]) || !preg_match("/^HTTP\/\d+\.?\d*/", $status[0]))
      die("Couldn't get HTTP version from response.");
    //  get the response code
    if(!isset($status[1]))
      die("Couldn't get HTTP response code from response.");
    else $this->response_code = $status[1];
    
    //  get the reason, e.g. "not found"
    if(!isset($status[2]))
      die("Couldn't get HTTP response reason from response.");
    else $this->response_reason = $status[2];
    //  read the headers
    do {
      $line = $this->readLine($fp);
      if($line != "") { 
        $header = split(":", $line);
        $this->response_headers[$header[0]] = ltrim($header[1]);
      }
    } while(!feof($fp) && $line != "");
    //  read the body
    $this->response_body = "";
    do {
      $line = $this->readLine($fp); {
      if($line)
        $this->response_body .= "$line\n";
      }
    } while(!feof($fp));
    //  close the connection
    fclose($fp);
    return TRUE;
  }
  public function getStatus() {
    return $this->response_code;
  }
  public function getHeaders() {
    return $this->response_headers;
  }
  public function getResponseBody() {
    return $this->response_body;
  }
}
$req = new HttpRequest("http://www.iana.org/domains/example/", "GET");
$req->headers["Connection"] = "close";
$req->send() or die("Couldn't send!");
echo( $req->getResponseBody() );
?>
@f4stdev
f4stdev commented on Feb 1, 2014

You should add

"if (! $fp) return False;"

after "$fp = fsockopen($this->host_ip, $this->port);".
otherwise, in case the remotehost is down, there will be an endless running php script echoing warnings that you can't read a stream out of "False"
@haroldSanchezb
haroldSanchezb commented on Jul 18, 2014

i have trouble, when i send an api key by get url
@alexander0312
alexander0312 commented on Aug 9, 2014

cool
@sukhrobik
sukhrobik commented on Mar 4, 2015

What should we do if we have a token to pass. For example:
$req = new HttpRequest("http://website.com?token=1234567890", "GET");
@negeric
negeric commented on Jan 9, 2017 •

This is fantastic, however, I ran into an issue while connecting to via HTTPS. A non-secure connection was being made to port 443 if I passed https://domain.com as the URL. I modified your example to use tls:// if the url_info['scheme'] == https.

<?php

/*
 *  simple HttpRequest example using PHP
 *  tom slankard
 */

class HttpRequest {

  public $url = null;
  public $method = 'GET';
  public $body = null;
  public $headers = Array();
  public $allow_redirect = true;

  private $url_info = null;
  private $host_name = null;
  private $host_ip = null;
  private $response_body = null;
  private $response_headers = Array();
  private $response_code = null;
  private $response_message = null;
  private $port = null;
  private $verbose = true;
  private $protocol = null;

  public function __construct($url, $method = 'GET') {

    $this->url = $url;
    $this->method = $method;

    //  parse url
    $this->url_info = parse_url($url);
    $this->host_name = $this->url_info['host'];
    $this->host_ip = gethostbyname($this->host_name);

    //  get port number given the scheme
    if(!isset($this->url_info['port'])) {
      if($this->url_info['scheme'] == "http") {
        $this->port = 80;
        $this->protocol = "";
      } else if($this->url_info['scheme'] == "https") {
        $this->port = 443;
        $this->protocol = "tls://";
      }
    } else {
      $this->port = $this->url_info['port'];
      $this->protocol = "";
    }

    //  add default headers
    $this->headers["Host"] = "$this->host_name";
    $this->headers["Connection"] = "close";

  }

  private function constructRequest() {
    $path = "/";
    if(isset($this->url_info['path']))
      $path = $this->url_info['path'];

    $req = "$this->method $path HTTP/1.1\r\n";
    foreach($this->headers as $header => $value) {
      $req .= "$header: $value\r\n";
    }

    return "$req\r\n";
  }

  ///  reads a line from a file
  function readLine($fp)
  {
    $line = "";

    while (!feof($fp)) {
      $line .= fgets($fp, 2048);
      if (substr($line, -1) == "\n") {
        return rtrim($line, "\r\n");
      }
    }
    return $line;
  }

  public function send() {

    //$fp = fsockopen($this->host_ip, $this->port);
    $fp = fsockopen($this->protocol . $this->host_ip, $this->port);

    //  construct request
    $request = $this->constructRequest();

    //  write request to socket
    fwrite($fp, $request);

    //  read the status line
    $line = $this->readline($fp);
    $status = explode(" ", $line);

    //  make sure the HTTP version is valid
    if(!isset($status[0]) || !preg_match("/^HTTP\/\d+\.?\d*/", $status[0]))
      die("Couldn't get HTTP version from response.");

    //  get the response code
    if(!isset($status[1]))
      die("Couldn't get HTTP response code from response.");
    else $this->response_code = $status[1];

    //  get the reason, e.g. "not found"
    if(!isset($status[2]))
      die("Couldn't get HTTP response reason from response.");
    else $this->response_reason = $status[2];

    //  read the headers
    do {
      $line = $this->readLine($fp);
      if($line != "") {
        $header = split(":", $line);

        $this->response_headers[$header[0]] = ltrim($header[1]);
      }
    } while(!feof($fp) && $line != "");

    //  read the body
    $this->response_body = "";
    do {
      $line = $this->readLine($fp); {
      if($line)
        $this->response_body .= "$line\n";
      }
    } while(!feof($fp));

    //  close the connection
    fclose($fp);

    return TRUE;
  }

  public function getStatus() {
    return $this->response_code;
  }

  public function getHeaders() {
    return $this->response_headers;
  }

  public function getResponseBody() {
    return $this->response_body;
  }

}

?>

@rotasul
rotasul commented on Mar 9, 2017 •

great script! I used as detour from a server with (allow_url_fopen=false), just a little modification to read binary :))) []'s
@sujayvenaik

Attach files by dragging & dropping,

, or pasting from the clipboard.
Styling with Markdown is supported

    © 2018 GitHub, Inc.
    Terms
    Privacy
    Security
    Status
    Help

    Contact GitHub
    API
    Training
    Shop
    Blog
    About

