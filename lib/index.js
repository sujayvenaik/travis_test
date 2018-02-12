_ = require('lodash');
sdk = require('postman-collection');


function getbody (request, indentation){
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
                    list.reduce(function (list, value) {
                        if (value.key) {
                            temp += value.key;
                        }
                        temp += '=';
                        if (value.value) {
                            temp += value.value;
                        }
                        temp += '&';
                    }, '');
                }
                initial += 'payload = \'' +
                    temp.substring(0, temp.length - 1) + '\'\n';
                return initial;
            case 'formdata':
                list = _.reject(request.body[request.body.mode], 'disabled');
                if (!_.isEmpty(list)) {
                    list.reduce(function (list, value) {
                        if (value.type === 'text' && value.key) {
                            temp += '------WebKitFormBoundary7MA4YWxkTrZu0gW\\r\\n' +
                                    'Content-Disposition: form-data;' +
                                    ' name=\\"' + value.key + '\\"\\r\\n\\r\\n';
                            if (value.value) {
                                temp += value.value;
                            }
                            temp += '\\r\\n';
                        }
                        else if (value.type === 'file' && value.key && value.src) {
                            temp += '------WebKitFormBoundary7MA4YWxkTrZu0gW\\r\\nContent-Disposition: form-data;' +
                                'name=\\"' + value.key + '\\"; filename=\\"' + value.src +
                                '\\"\\r\\nContent-Type: text/x-markdown\\r\\n\\r\\n\\r\\n';
                        }
                    }, '');
                }
                initial += 'payload = \'' + temp + '------WebKitFormBoundary7MA4YWxkTrZu0gW--\'\n';
                return initial;
            default:
                return 'payload = \'\'\n';

        }
    }
}

function getheaders (request, indentation){
    var headers = '',
        list;
    if (request.body.mode === 'formdata') {
        request.upsertHeader({
            key: 'Content-Type',
            value: 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
        });

    }
    list = _.reject(request.toJSON().header, 'disabled');
    if (!_.isEmpty(list)) {
        list.reduce(function (list, value) {
            headers += indentation + '\'' + value.key + '\': \'' + value.value + '\',\n' ;
        }, '');
        return 'headers = {\n' + headers + '}\n';
    }
    return 'headers = {}\n';
}

module.exports = function (request, options) {
    var snippet = '',
        indentation = '',
        identity = '';
    identity = options.indentType === 'tab' ? '\t' : ' ';

    indentation = identity.repeat(options.indentCount);
    snippet += 'import requests\n';
    snippet += 'url = "'+ request.url.toString() +'"\n';
    snippet += getbody(request.toJSON(), indentation);
    snippet += getheaders(request, indentation);
    snippet += 'response = requests.request("'+ request.method+'", url, data=payload, headers=headers)\n';
    snippet += 'print(response.text)';
    console.log(snippet);
    return snippet;
    };