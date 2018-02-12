var _ = require('lodash'),
    sdk = require('postman-collection');

function getbody (request, indentation) {
    // used to check wether body is present in the request or not
    if (request.body) {
        var temp = '',
            initial = '',
            list;
        switch (request.body.mode) {
            case 'raw':
                if (!_.isEmpty(request.body[request.body.mode])) {
                    initial += 'request.body = ' +
                        (JSON.stringify(request.body[request.body.mode])) + '\n';
                }
                return initial;
            case 'urlencoded' :
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
            initial += 'request.body =  \'' +
                temp.substring(0, temp.length - 1) + '\'\n';
            return initial;
                break;
        
            case 'formdata' :
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
            initial += 'request.body = "' + temp + '------WebKitFormBoundary7MA4YWxkTrZu0gW--"\n';
            return initial;

            default : 
                return ''
        }       
    }
}

function getheaders (request, indentation){
    var headers = '';
    if (request.body.mode === 'formdata') {
        request.upsertHeader({
            key: 'Content-Type',
            value: 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
        });

    }
    list = _.reject(request.toJSON().header, 'disabled');
    if (!_.isEmpty(list)) {
        list.reduce(function (list, value) {
            headers += 'request["' + value.key + '"] = \'' + value.value + '\'\n' ;
        }, '');
        return headers;
    }
    return '';
}

/**
 * @param  {Object} request : postman sdk-request object
 * @param  {Object} options : plugin specific options
 * @returns {String} : Request snippet in the desired language variant
 */
module.exports = function (request, options) {
    var snippet = '',
        indentation = '',
        identity = '';
    identity = options.indentType === 'tab' ? '\t' : ' ';

    indentation = identity.repeat(options.indentCount);

    snippet += 'require \'uri\'\nrequire \'net/http\'\n\n';
    snippet += 'url = URI("'+ request.url.toString() + '")\n';
    
    snippet += 'http = Net::HTTP.new(url.host, url.port)\n\nrequest = Net::HTTP::Post.new(url)\n';
    
    if(request.toJSON().url.protocol === 'https'){
        snippet += 'http.use_ssl = true\n'; 
    }
    snippet += getheaders(request,indentation) + '\n';
    snippet += getbody(request.toJSON(),indentation);
    
    snippet += 'response = http.request(request)\nputs response.read_body';
    return snippet;
    };