var _ = require('lodash'),
    parseBody = require('./util/parseBody'),
    sdk = require('postman-collection'),
    handleEscape = require('./util/handleEscape').handleEscape;

/**
 * Used to get the headers and put them in the desired form of the language
 * 
 * @param  {Object} request - postman SDK-request object 
 * @param  {String} indentation - used for indenting snippet's structure
 * @returns {String} - request headers in the desired format
 */
function getHeaders (request, indentation) {
    var headerObject = request.getHeaders({enabled: true}),
        headerMap;

    if (!_.isEmpty(headerObject)) {
        headerMap = _.map(Object.keys(headerObject), function (key) {
            return `${indentation}'${handleEscape(key)}' => ` +
            `'${handleEscape(headerObject[key])}'`;
        });
        return `$request->setHeaders(array(\n${headerMap.join(',\n')}\n));`;
    }
    return '';
}

/**
     * @param  {Object} request - postman SDK-request object
     * @param  {Object} [options]
     * @param  {String} [options.indentType] - type of indentation eg: spaces/tab (default: space)
     * @param  {String} [options.indentCount] - frequency of indent (default: 4 for indentType: space, 
     *                                                               default: 2 for indentType: tab)
     * @param  {Function} callback - function with parameters (error, snippet)
     */
module.exports = function (request, options, callback) {
    var snippet = '',
        indentation = '',
        identity = '';
    if (_.isFunction(options)) {
        callback = options;
        options = null;
    }
    else if (!_.isFunction(callback)) {
        throw new Error('Php-Pecl(HTTP)~convert: Callback is not a function');
    }
    if (!sdk.Request.isRequest(request)) {
        return callback('Php-Pecl(HTTP)~convert: Not a postman sdk-request object', null);
    }

    identity = options.indentType === 'tab' ? '\t' : ' ';
    indentation = identity.repeat(options.indentCount);

    snippet = '<?php\n';
    snippet += '$client = new http\\Client;\n';
    snippet += '$request = new http\\Client\\Request;\n';
    snippet += '$request->setRequestUrl(\'' +
            `${handleEscape(request.url.toString())}');\n`;
    snippet += `$request->setRequestMethod('${request.method}');\n`;
    if (!_.isEmpty(request.body)) {
        snippet += '$body = new http\\Message\\Body;\n';
        snippet += `${parseBody(request.toJSON(), indentation)}`;
        snippet += '$request->setBody($body);\n';
    }
    snippet += `${getHeaders(request, indentation)}\n`;
    snippet += '$client->enqueue($request)->send();\n';
    snippet += '$response = $client->getResponse();\n';
    snippet += 'echo $response->getBody();\n';
    snippet += '?>';

    console.log(snippet);
    return callback(null, snippet);
};
