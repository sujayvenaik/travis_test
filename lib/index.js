_ = require('lodash');
sdk = require('postman-collection');

/*
import http.client

conn = http.client.HTTPConnection("hooks,slack,com")

payload = "sda=asd&laksj=kajsd"

headers = { 'Content-Type': "application/x-www-form-urlencoded" }

conn.request("POST", "services,T8NR5K5RU,B8N437GSH,2DCd15jK7YiIidrJUeCsSGeA", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
*/

function getbody (request, identity, frequency){
    // used to check wether body is present in the request or not
    if (request.body) {
        var initial = '',
            temp = '',
            list;
        switch (request.body.mode) {
            case 'raw':
                if (!_.isEmpty(request.body[request.body.mode])) {
                    initial += 'payload = \'' +
                        (JSON.stringify(request.body[request.body.mode])) + '\'\n';
                }
                return initial;
            case 'urlencoded':
                list = _.reject(request.body[request.body.mode], 'disabled');
                if (!_.isEmpty(list)) {
                    _.forEach(list, function (value) {
                        if (value.key && value.value) {
                            temp += value.key + '=' + value.value + '&';
                        }
                    });
                }
                initial += 'payload = \'' +
                    temp.substring(0, temp.length - 1) + '\'\n';
                return initial;
            case 'formdata':
                list = _.reject(request.body[request.body.mode], 'disabled');
                if (!_.isEmpty(list)) {
                    _.forEach(list, function (value) {
                        if (value.type === 'text' && value.key && value.value) {
                            temp += '------WebKitFormBoundary7MA4YWxkTrZu0gW\\r\\n' +
                                    'Content-Disposition: form-data;' +
                                    ' name=\\"' + value.key + '\\"\\r\\n\\r\\n' + value.value + '\\r\\n';
                        }
                        else if (value.type === 'file' && value.key && value.src) {
                            temp += '------WebKitFormBoundary7MA4YWxkTrZu0gW\\r\\nContent-Disposition: form-data;' +
                                'name=\\"' + value.key + '\\"; filename=\\"' + value.src +
                                '\\"\\r\\nContent-Type: text/x-markdown\\r\\n\\r\\n\\r\\n';
                        }
                    });
                }
                initial += 'payload = \'' + temp + '\'\n';
                return initial;
            default:
                return 'payload = \'\'\n';

        }
    }
}

function getheaders (request, identity, frequency){
    var headers = '',
        list;
    if (request.body.mode === 'formdata') {
        request.addHeader({
            key: 'content-Type',
            value: 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
        });
    }
    list = _.reject(request.toJSON().header, 'disabled');
    if (!_.isEmpty(list)) {
        _.forEach(list, function (value) {
            headers += identity.repeat(frequency) + '\'' + value.key + '\': \'' + value.value + '\',\n' ;
        });
        return 'headers = {\n' + headers + '}\n';
    }
    return '';
}

module.exports = function (request, options) {
    var identity = '',
        frequency,
        snippet = '';
    if (options && options.indentType === 'tab') {
        identity = '\t';
    }
    else if (options && options.indentType === 'space') {
        identity = ' ';
    }
    else {
        identity = ' ';
    }
    if (options && typeof options.indentCount === 'number') {
        frequency = options.indentCount;
    }
    else {
        frequency = 4;
    }
    // runs on python 3

    snippet += 'import http.client\n';
    snippet += 'conn = http.client.HTTPConnection("'+ request.url.host.join('.') +'")\n';
    snippet +=  getbody(request.toJSON(),identity,frequency);
    snippet += getheaders(request,identity, frequency);
    snippet += 'conn.request("'+ request.method+'", "/'+ request.url.path.join('/') +'", payload, headers)\n';
    snippet += 'res = conn.getresponse()\ndata = res.read()\n\nprint(data.decode("utf-8"))';
    return snippet;
    };