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
        var temp='',initial='';
        switch (request.body.mode) {
            
            case 'raw':
                if (!_.isEmpty(request.body[request.body.mode])) {
                    initial += '$body->append(\n' + JSON.stringify(request.body[request.body.mode]) + '\n);\n';
                }
                return initial;
                break;

            case 'urlencoded':
                list = _.filter(request.body[request.body.mode], function(record) { return !record.disabled; });
                if (!_.isEmpty(list)) {
                    _.forEach(list, function(value) {
                        if (value.key && value.value) {
                            temp += identity.repeat(frequency) + '\'' + value.key + '\' => \'' + value.value + '\',\n' ;
                        }
                    });
                }
                initial = '$body->append(new http\\QueryString(array(\n' + temp + '\n)));\n';
                return initial;
                break;
            case 'formdata':
                list = _.filter(request.body[request.body.mode], function(record) { return !record.disabled; });
                if (!_.isEmpty(list)) {
                    _.forEach(list, function(value) {
                        if (value.key && value.value) {
                            temp += identity.repeat(frequency) + '\'' + value.key + '\' => \'' + value.value + '\',\n' ;
                        }
                    });
                }
                initial = '$body->addForm(array(\n' + temp + '\n), NULL);\n';
                return initial;
                break;
            default:
            // console.log('No Case');
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
            key: 'content-Type',
            value: 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
        });
    }
    list = _.filter(request.toJSON().header, function(record) { return !record.disabled; });
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
    var frequency = options.indentTab ? options.indentTab : options.indentSpace ? options.indentSpace : 4,
        identity =  options.indentTab ? '\t' : options.indentSpace ? ' ' : ' ';
    
        // concatenation and making up the final string

    snippet = '<?php\n$client = new http\\Client;\n$request = new http\\Client\\Request;\n';   
    if(!_.isEmpty(request.body)){
        snippet += '$body = new http\\Message\\Body;\n';
        snippet += getbody(request.toJSON(), identity, frequency)
        snippet += '$request->setBody($body);\n';
    }
    snippet += '$request->setRequestUrl(\''+ request.url.toString() +'\');\n';
    snippet += '$request->setRequestMethod(\''+ request.method +'\');\n'; 
    snippet += getheaders(request, identity, frequency);
    snippet += '$client->enqueue($request)->send();\n$response = $client->getResponse();\n\necho $response->getBody();\n';
    snippet += '?>'  
    return snippet;
    };