require 'uri'
require 'net/http'

url = URI("https://postman-echo.com/post")
http = Net::HTTP.new(url.host, url.port)

request = Net::HTTP::Post.new(url)
http.use_ssl = true
request["Content-Type"] = 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'

request.body = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"fdjks\"\r\n\r\ndsf\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"sdf\"\r\n\r\nnj\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--"
response = http.request(request)
puts response.read_body