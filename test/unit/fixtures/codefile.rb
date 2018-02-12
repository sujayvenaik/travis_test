require 'uri'
require 'net/http'

url = URI("https://postman-echo.com/post")

http = Net::HTTP.new(url.host, url.port)

request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/javascript'
request["Cache-Control"] = 'no-cache'
request["Postman-Token"] = '1e270fc5-ff2b-4546-9eba-814368b8487b'
request.body = "var val = 6;\nconsole.log(val);"

response = http.request(request)
puts response.read_body