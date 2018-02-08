// var _ = require('lodash');

// /**
//  * Used to get the body of the request and put it in the snippet for the desired variant
//  * 
//  * @param  {Object} request - request object 
//  * @param  {String} identity - wether a tab or space
//  * @param  {String} frequency - count as to how many tabs/space
//  */
// function getbody (request, identity, frequency) {
//     // used to check wether body is present in the request or not
//     if (request.body) {
//         var initial = '',
//             temp = '',
//             list;
//         switch (request.body.mode) {
//             case 'raw':
//                 if (!_.isEmpty(request.body[request.body.mode])) {
//                     initial += identity.repeat(frequency) + 'CURLOPT_POSTFIELDS => ' +
//                         (JSON.stringify(request.body[request.body.mode])) + ',\n';
//                 }
//                 return initial;
//             case 'urlencoded':
//                 list = _.reject(request.body[request.body.mode], 'disabled');
//                 if (!_.isEmpty(list)) {
//                     _.forEach(list, function (value) {
//                         if (value.key && value.value) {
//                             temp += value.key + '=' + value.value + '&';
//                         }
//                     });
//                 }
//                 initial += identity.repeat(frequency) + 'CURLOPT_POSTFIELDS => "' +
//                     temp.substring(0, temp.length - 1) + '",\n  ';
//                 return initial;
//             case 'formdata':
//                 list = _.reject(request.body[request.body.mode], 'disabled');
//                 if (!_.isEmpty(list)) {
//                     _.forEach(list, function (value) {
//                         if (value.type === 'text' && value.key && value.value) {
//                             temp += '------WebKitFormBoundary7MA4YWxkTrZu0gW\\r\\n' +
//                                     'Content-Disposition: form-data;' +
//                                     ' name=\\"' + value.key + '\\"\\r\\n\\r\\n' + value.value + '\\r\\n';
//                         }
//                         else if (value.type === 'file' && value.key && value.src) {
//                             temp += '------WebKitFormBoundary7MA4YWxkTrZu0gW\\r\\nContent-Disposition: form-data;' +
//                                 'name=\\"' + value.key + '\\"; filename=\\"' + value.src +
//                                 '\\"\\r\\nContent-Type: text/x-markdown\\r\\n\\r\\n\\r\\n';
//                         }
//                     });
//                 }
//                 initial += identity.repeat(frequency) + 'CURLOPT_POSTFIELDS => "' + temp +
//                     '------WebKitFormBoundary7MA4YWxkTrZu0gW--",\n';
//                 return initial;
//             default:
//                 return initial;

//         }
//     }
// }

// /**
//  * Used to get the headers and put them in the desired form of the language
//  * 
//  * @param  {Object} request - request object 
//  * @param  {String} identity - wether a tab or space
//  * @param  {String} frequency - count as to how many tabs/space
//  */
// function getheaders (request, identity, frequency) {
//     var headers = '',
//         list;
//     if (request.body.mode === 'formdata') {
//         request.addHeader({
//             key: 'content-Type',
//             value: 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
//         });
//     }
//     list = _.reject(request.toJSON().header, 'disabled');
//     if (!_.isEmpty(list)) {
//         _.forEach(list, function (value) {
//             headers += identity.repeat(frequency * 2) + '"' + value.key + ': ' + value.value + '",\n';
//         });
//         return 'CURLOPT_HTTPHEADER => array(\n' + headers + identity.repeat(frequency) + '),';
//     }
//     return '';
// }

// /**
//  * @param  {Object} request - postman request object 
//  * @param  {Object} [options]
//  * @param  {Object} [options.indentType] - tabs/spaces for indentation
//  * @param  {Object} [options.indentCount] - count/frequency for indentation
//  * @returns {String} 
//  */
// module.exports = function (request, options) {
//     var identity = '',
//         frequency,
//         snippet = '';
//     if (options && options.indentType === 'tab') {
//         identity = '\t';
//     }
//     else if (options && options.indentType === 'space') {
//         identity = ' ';
//     }
//     else {
//         identity = ' ';
//     }
//     if (options && typeof options.indentCount === 'number') {
//         frequency = options.indentCount;
//     }
//     else {
//         frequency = 4;
//     }
//     // concatenation and making up the final string
//     snippet = '<?php\n$curl = curl_init();\ncurl_setopt_array($curl, array(\n' +
//         identity.repeat(frequency) + 'CURLOPT_URL => "' + request.url.toString() + '",\n' +
//         identity.repeat(frequency) + 'CURLOPT_RETURNTRANSFER => true,\n' +
//         identity.repeat(frequency) + 'CURLOPT_ENCODING => "",\n' +
//         identity.repeat(frequency) + 'CURLOPT_MAXREDIRS => 10,\n' +
//         identity.repeat(frequency) + 'CURLOPT_TIMEOUT => 30,\n' +
//         identity.repeat(frequency) + 'CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,\n' +
//         identity.repeat(frequency) + 'CURLOPT_CUSTOMREQUEST => "' + request.method + '",\n' +
//         getbody(request.toJSON(), identity, frequency) +
//         getheaders(request, identity, frequency) +
//         '\n));\n' +
//         '$response = curl_exec($curl);\n' +
//         '$err = curl_error($curl);\n' +
//         'curl_close($curl);\n' +
//         'if ($err) {\n' +
//         identity.repeat(frequency) + 'echo "cURL Error #:" . $err;\n' +
//         '} else {\n' + identity.repeat(frequency) + 'echo $response;\n' +
//         '} ?>';

//     return snippet;
// };
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
                list = _.filter(request.body[request.body.mode], function(record) { return !record.disabled; });
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
                list = _.filter(request.body[request.body.mode], function(record) { return !record.disabled; });
                if (!_.isEmpty(list)) {
                    _.forEach(list, function(value) {
                            if(value.type === 'text' && value.key && value.value){
                                temp += '------WebKitFormBoundary7MA4YWxkTrZu0gW\\r\\n' + 
                                    'Content-Disposition: form-data;' + 
                                    ' name=\\"' + value.key + '\\"\\r\\n\\r\\n' + value.value + '\\r\\n';
                            }
                            else if(value.type === 'file' && value.key && value.src) {
                                temp += '------WebKitFormBoundary7MA4YWxkTrZu0gW\\r\\nContent-Disposition: form-data;'+
                                'name=\\"'+ value.key + '\\"; filename=\\"' + value.src +
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