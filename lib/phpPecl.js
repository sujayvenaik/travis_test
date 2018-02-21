var _ = require('lodash'),
    parsebody = require('./util/parseBody'),
    sdk = require('postman-collection');

/**
 * Used to get the headers and put them in the desired form of the language
 * 
 * @param  {Object} request - postman sdk-request object 
 * @param  {String} indentation - used for indenting snippet's structure
 * @returns {String} - request headers in the desired format
 */
function getheaders (request, indentation) {
    var headerObject = request.getHeaders({enabled: true, ignoreCase: true}),
        temp;
    if (!_.isEmpty(headerObject)) {
        temp = _.map(Object.keys(headerObject), function (key) {
            return `${indentation.repeat(2)}'${key.replace(/'/g, '\\\'')}' => ` +
            `'${headerObject[key].replace(/'/g, '\\\'')}'`;
        });
        return `$request->setHeaders(array(\n${temp.join(',\n')}\n));`;
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
        identity = '',
        defaultOptions = {
            indentType: 'space',
            indentCount: 4
        };
    if (_.isFunction(options)) {
        callback = options;
        options = null;
    }
    else if (!_.isFunction(callback)) {
        throw new Error('Php-Curl~convert: Callback is not a function');
    }
    if (!sdk.Request.isRequest(request)) {
        return callback('Php-Curl~convert: Not a postman sdk-request object', null);
    }

    options = _.merge({}, defaultOptions, options);
    options.indentCount = _.isNumber(options.indentCount) && _.inRange(options.indentCount, 0, 8) ?
        options.indentCount : options.indentType === 'tab' ? 2 : 4;

    identity = options.indentType === 'tab' ? '\t' : ' ';
    indentation = identity.repeat(options.indentCount);

    snippet = '<?php\n';
    snippet += '$client = new http\\Client;\n';
    snippet += '$request = new http\\Client\\Request;\n';
    
    snippet += '$request->setRequestUrl(\'' +
            `${request.url.toString().replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}');\n`;
    snippet += `$request->setRequestMethod('${request.method}');\n`;
    if (!_.isEmpty(request.body)) {
	snippet += '$body = new http\\Message\\Body;\n';
        snippet += `${parsebody(request.toJSON(), indentation)}\n`;
        snippet += '$request->setBody($body);\n';
    }
    snippet += `${getheaders(request, indentation)}\n`;
    
    snippet += '$client->enqueue($request)->send();\n';
    snippet += '$response = $client->getResponse();\n';
    snippet += 'echo $response->getBody();\n';
    snippet += '?>';

    return callback(null, snippet);
};
