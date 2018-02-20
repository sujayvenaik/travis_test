var _ = require('lodash'),
    parsebody = require('../lib/util/parseBody'),
    sdk = require('postman-collection');

/**
 * Used to get the headers and put them in the desired form of the language
 * 
 * @param  {Object} request - postman sdk-request object 
 * @param  {String} indentation 
 */
function getheaders (request, indentation) {
    var headerObject = request.getHeaders({enabled: true, ignoreCase: true}),
        temp;
    if (!_.isEmpty(headerObject)) {
        temp = _.map(Object.keys(headerObject), function (value) {
            return `${indentation.repeat(2)}'${value.replace(/'/g, '\\\'')}' => ` +
            `'${headerObject[value].replace(/'/g, '\\\'')}'`;
        });
        return `$request->setHeaders(array(\n${temp.join(',\n')}\n));`;
    }
    return '';
}

module.exports = {
    /**
     * @param  {Object} request - postman sdk-request object
     * @param  {Object} options
     * @param  {String} options.indentType - indent using spaces/tab
     * @param  {String} options.indentCount - frequency of indent
     * @param  {Function} callback
     */
    convert: function (request, options, callback) {
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

    snippet = `<?php\n`
    snippet += `$client = new http\\Client;\n`;
    snippet += `$request = new http\\Client\\Request;\n`;
    if (!_.isEmpty(request.body)) {
        snippet += `$body = new http\\Message\\Body;\n`
        snippet += `${parsebody(request.toJSON(), indentation)}\n`;
    }
    snippet += `$request->setRequestUrl(\'${request.url.toString().replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}\');\n`;
    snippet += `$request->setRequestMethod(\'${request.method}\');\n`;
    if(!_.isEmpty(request.body)){
        snippet += `$request->setBody($body);\n`;
    }
    if(request.body.mode !== 'form-data'){
        snippet += `${getheaders(request, indentation)}\n`;
    }
     snippet += `$client->enqueue($request)->send();\n`;
    snippet += `$response = $client->getResponse();\n`;
    snippet += `echo $response->getBody();\n`
    snippet += `?>`;
    console.log(snippet);
    return callback(null, snippet);
    }
};
