var _ = require('lodash'),
    sdk = require('postman-collection');

/**
 * Used to get the request body in the desired form of the language
 * 
 * @param  {Object} request - postman sdk-request object 
 * @param  {String} identation - indentation
 * @returns {String} 
 **/
function getbody (request, indentation) {
    // used to check wether body is present in the request or not
    if (request.body) {
        var initial = '',
            temp = '',
            list;
            switch (request.body.mode) {
                case 'raw':
                    if (!_.isEmpty(request.body[request.body.mode])) {
                        initial += 'payload = ' +
                            (JSON.stringify(request.body[request.body.mode])) + '\n';
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

/**
 * Used to get the request headers in the desired form of the language
 * 
 * @param  {Object} request - postman sdk-request object 
 * @param  {String} identation - indentation
 * @returns {String} 
 **/
function getheaders (request, indentation){
    var headers = '',
        list;
    if (request.body.mode === 'formdata') {
        request.upsertHeader({
            key: 'content-Type',
            value: 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
        });
    }
    list = _.reject(request.toJSON().header, 'disabled');
    if (!_.isEmpty(list)) {
        list.reduce(function (list, value) {
            headers += indentation + '\'' + value.key + '\': \'' + value.value + '\',\n' ;
        },'');
        return 'headers = {\n' + headers + '}\n';
    }
    return 'headers = {}\n';
}

/**
 * Used to get the query parameters in the desired form of the language
 * 
 * @param  {Object} request - postman sdk-request object 
 * @returns {String} 
 **/
function getQueryParams (request){
    var queryParam = '';
    list = _.reject(request.toJSON().url.query, 'disabled');
    if (!_.isEmpty(list)) {
        queryParam += '?';
        list.reduce(function (list, value) {
            queryParam += value.key + '=' + value.value + '&' ;
        }, '');
        return queryParam.substring(0, queryParam.length-1);
    }
    return '';
}

/**
 * @param  {Object} request : postman sdk-request object
 * @param  {Object} options : plugin specific options
 * @returns {String} : Request snipper in the desired language variant
 */
module.exports = function (request, options) {
    var snippet = '',
        indentation = '',
        identity = '';
    identity = options.indentType === 'tab' ? '\t' : ' ';
    // runs on python 3
    console.log(request.url);
    snippet += 'import http.client\n';
    snippet += 'conn = http.client.HTTPSConnection("'+ request.url.host.join('.') +'")\n';
    snippet += getbody(request.toJSON(), indentation);
    snippet += getheaders(request, indentation);
    snippet += 'conn.request("'+ request.method+'", "/'+ request.url.path.join('/') + getQueryParams(request) +'", payload, headers)\n';
    snippet += 'res = conn.getresponse()\ndata = res.read()\n\nprint(data.decode("utf-8"))';
    return snippet;
    };