var _ = require('lodash'),
    handleEscape = require('./handleEscape').handleEscape;

/**
 * Used to parse the body of the postman SDK-request and return in the desired format
 * 
 * @param  {Object} request - postman SDK-request object 
 * @param  {String} indentation - used for indenting snippet's structure
 * @returns {String} - request body
 */
module.exports = function (request, indentation) {
    // used to check whether body is present in the request or not
    if (request.body) {
        var bodyDataMap = [],
            bodyFileMap = [],
            requestBody = '',
            enabledBodyList;
        switch (request.body.mode) {
            case 'raw':
                if (!_.isEmpty(request.body[request.body.mode])) {
                    requestBody += `$body->append('${request.body[request.body.mode]}');\n`;
                }
                return requestBody;

            case 'urlencoded':
                enabledBodyList = _.reject(request.body[request.body.mode], 'disabled');
                if (!_.isEmpty(enabledBodyList)) {
                    bodyDataMap = _.map(enabledBodyList, function (value) {
                        return `${indentation}'${handleEscape(value.key)}' => ` +
                            `'${handleEscape(value.value)}'`;
                    });
                    requestBody = `$body->append(new http\\QueryString(array(\n${bodyDataMap.join(',\n')})));`;
                }
                return requestBody;

            case 'formdata':
                enabledBodyList = _.reject(request.body[request.body.mode], 'disabled');
                if (!_.isEmpty(enabledBodyList)) {
                    bodyDataMap = _.map(_.filter(enabledBodyList, {'type': 'text'}), function (value) {
                        return (`${indentation}'${handleEscape(value.key)}' => ` +
                            `'${handleEscape(value.value)}'`);
                    });
                    bodyFileMap = _.map(_.filter(enabledBodyList, {'type': 'file'}), function (value) {
                        return (`${indentation.repeat(2)}array('name' => '${handleEscape(value.key)}', ` +
                            `'type' => '${handleEscape(value.type)}', ` +
                            `'file' => '${handleEscape(value.src)}', ` +
                            '\'data\' => null)');
                    });
                    requestBody = `$body->addForm(array(\n${bodyDataMap.join(',\n')}\n), ` +
                        `array(${bodyFileMap.join(',\n')}));\n`;
                }
                return requestBody;

            default:
                return requestBody;
        }
    }
    return '';
};
