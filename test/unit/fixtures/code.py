import requests

response = requests.post('https://postman-echo.com/post', data={'a': 'b'},files=(('foo', 'bar'), ('spam', 'eggs')))
print(response.text)