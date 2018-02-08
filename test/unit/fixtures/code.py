import requests
url = "https://postman-echo.com/post?pm=0&postman=1"
payload=''
headers = {
	'1': 'a',
	'2': 'b',
}
response = requests.request("POST", url, data=payload, headers=headers)
print(response.text)