require 'uri'
require 'net/http'

url = URI("https://postman-echo.com/post")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = (url.scheme == "https")
request = Net::HTTP::Post.new(url)
request["Content-Type"] = 'application/javascript'
request.body = "var val = 6;\nconsole.log(val);"

response = http.request(request)
puts response.read_body
