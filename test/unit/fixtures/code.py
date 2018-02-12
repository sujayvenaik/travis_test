import http.client
conn = http.client.HTTPSConnection("postman-echo.com")
payload = "var val = 6;\nconsole.log(val);"
headers = {
'Content-Type': 'application/javascript',
}
conn.request("POST", "/post", payload, headers)
res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))