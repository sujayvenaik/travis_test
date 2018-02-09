_ = require('lodash');
sdk = require('postman-collection');


/**
 * Used to get the body of the request and put it in the snippet for the desired variant
 * 
 * @param  {Object} request - request object 
 * @param  {String} identity - wether a tab or space
 * @param  {String} frequency - count as to how many tabs/space
 */

function getbody (request, identity, frequency){
    // used to check wether body is present in the request or not
    if (request.body) {
        var temp='', initial = '';
        switch (request.body.mode) {
            case 'raw':
                if (!_.isEmpty(request.body[request.body.mode])) {
                    initial += '$request->setBody(' + request.body[request.body.mode].toString() + '),\n';
                }
                return initial;
                break;

            case 'urlencoded':
                list = _.reject(request.body[request.body.mode], 'disabled');
                if (!_.isEmpty(list)) {
                    _.forEach(list, function(value) {
                        if (value.key && value.value) {
                            temp += identity.repeat(frequency) + '\'' + value.key + '\' => \'' + value.value + '\',\n' ;
                        }
                    });
                }
                initial += '$request->setContentType(\'application/x-www-form-urlencoded\');\n';
                initial += '$request->setPostFields(array(\n' + temp + '\n));\n';
                return initial;
                break;

            case 'formdata':
                list = _.reject(request.body[request.body.mode], 'disabled');
                if (!_.isEmpty(list)) {
                    _.forEach(list, function(value) {
                        if (value.type === 'text' && value.key) {
                            temp += '------WebKitFormBoundary7MA4YWxkTrZu0gW\\r\\n' +
                                    'Content-Disposition: form-data;' +
                                    ' name=\\"' + value.key + '\\"\\r\\n\\r\\n';
                            if (value.value){
                                temp += value.value;
                            }
                            temp += '\\r\\n';
                        }
                        else if (value.type === 'file' && value.key && value.src) {
                            temp += '------WebKitFormBoundary7MA4YWxkTrZu0gW\\r\\nContent-Disposition: form-data;' +
                                'name=\\"' + value.key + '\\"; filename=\\"' + value.src +
                                '\\"\\r\\nContent-Type: text/x-markdown\\r\\n\\r\\n\\r\\n';
                        }
                    });
                }
                initial = '$request->setBody(\n\'' + temp + '------WebKitFormBoundary7MA4YWxkTrZu0gW--\'\n);\n';
                return initial;
                break;
            default:
                return initial;
        }
    }
    return initial;
}

/**
 * Used to get the headers and put them in the desired form of the language
 * 
 * @param  {Object} request - request object 
 * @param  {String} identity - wether a tab or space
 * @param  {String} frequency - count as to how many tabs/space
 */

function getheaders (request, identity, frequency){
    var headers = '';
    if(request.body.mode === 'formdata'){
        request.addHeader({
            key: 'Content-Type',
            value: 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
        });
    }
    list = _.reject(request.body[request.body.mode], 'disabled');
    if (!_.isEmpty(list)) {
        _.forEach(list, function(value) {
                headers += identity.repeat(frequency) + '\'' + value.key + '\' => \'' + value.value + '\',\n';
          });
          return '$request->setHeaders(array(\n' + headers +  '));\n';
        }
    return '';
}


/**
 * @param  {Object} request - request object 
 * @param  {Object} options - species as to tab/space and its frequency
 */
module.exports = function (request, options) {
    if(options && options.indentType === 'tab'){
        identity = '\t'
    }
    else if(options && options.indentType === 'space'){
        identity = ' '; 
    }
    else {
        identity = ' ';
    }
    if(options && typeof options.indentCount === 'number'){
        frequency = options.indentCount;
    }
    else {
        frequency = 4;
    }
        // concatenation and making up the final string
    snippet = '<?php\n$request = new HttpRequest();\n';
    snippet += '$request->setUrl(\''+ request.url.toString() +'\');\n';
    snippet += '$request->setMethod(HTTP_METH_'+ request.method +');\n';
    
    snippet += getheaders(request, identity, frequency);
    snippet += getbody(request.toJSON(), identity, frequency) + '\n';
    snippet += 'try {\n' + identity.repeat(frequency) + '$response = $request->send();\n';
    snippet += identity.repeat(frequency) +'echo $response->getBody();\n';
    snippet += '} catch (HttpException $ex) {\n';
    snippet += identity.repeat(frequency) +'echo $ex;';
    snippet += ' \n}';
    snippet += '?>'  
    return snippet;
    };