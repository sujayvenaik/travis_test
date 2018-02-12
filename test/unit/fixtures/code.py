import requests
url = "https://postman-echo.com/post"
payload = '------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"fdjks\"\r\n\r\ndsf\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"sdf\"\r\n\r\nsadaasd\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--'
headers = {
	'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
}
response = requests.request("POST", url, data=payload, headers=headers)
print(response.text)