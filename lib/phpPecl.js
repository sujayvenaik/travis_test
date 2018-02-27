var _ = require('lodash'),
    parseBody = require('./util/parseBody'),
    sdk = require('postman-collection'),
    sanitize = require('./util/sanitize').sanitize;

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
            return `${indentation}'${sanitize(key)}' => ` +
            `'${sanitize(headerObject[key])}'`;
        });
        return `$request->setHeaders(array(\n${headerMap.join(',\n')}\n));`;
    }
    return '';
}


module.exports = {
    /**
     * @returns {Array} plugin specific options
     */
    getOptions: function () {
        return [];
    },

    /**
     * @param  {Object} request - postman SDK-request object
     * @param  {Object} options
     * @param  {String} options.indentType - type of indentation eg: spaces/tab (default: space)
     * @param  {String} options.indentCount - frequency of indent (default: 4 for indentType: space, 
     *                                                               default: 2 for indentType: tab)
     * @param {Number} options.requestTimeout : time in milli-seconds after which request will bail out
                                                (default: 0 -> never bail out)
     * @param {Boolean} options.requestBodyTrim : whether to trim request body fields (default: false)
     * @param {Boolean} options.followRedirect : whether to allow redirects of a request
     * @param  {Function} callback - function with parameters (error, snippet)
     */
    convert: function (request, options, callback) {
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
        snippet += `$request->setRequestUrl('${sanitize(request.url.toString())}');\n`;
        snippet += `$request->setRequestMethod('${request.method}');\n`;
        if (!_.isEmpty(request.body)) {
            snippet += '$body = new http\\Message\\Body;\n';
            snippet += `${parseBody(request.toJSON(), indentation, options.requestBodyTrim)}`;
            snippet += '$request->setBody($body);\n';
        }
        snippet += '$request->setOptions(array(';
        snippet += options.requestTimeout === 0 ? '' : `'connecttimeout' => ${options.requestTimeout}`;
        snippet += options.followRedirect ? '' : ', \'redirect\' => false';
        snippet += '));\n';
        snippet += `${getHeaders(request, indentation)}\n`;
        snippet += '$client->enqueue($request)->send();\n';
        snippet += '$response = $client->getResponse();\n';
        snippet += 'echo $response->getBody();\n';
        snippet += '?>';

        return callback(null, snippet);
    }
};
