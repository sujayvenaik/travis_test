require 'uri'
require 'net/http'

url = URI("https://postman-echo.com/post")
http = Net::HTTP.new(url.host, url.port)

request = Net::HTTP::Post.new(url)
http.use_ssl = true
request["Content-Type"] = 'text/html'

request.body = "<html>\n  Test Test\n</html>"
response = http.request(request)
puts response.read_body