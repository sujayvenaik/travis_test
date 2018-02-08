import http.client
conn = http.client.HTTPConnection("postman-echo.com")
payload = ''
headers = {
	'1': 'a',
	'2': 'b',
}
conn.request("POST", "/post", payload, headers)
res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))