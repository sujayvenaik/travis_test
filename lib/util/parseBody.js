var _ = require('lodash');

/**
 * Used to get the body of the request and put it in the snippet for the desired variant
 * 
 * @param  {Object} request - postman request object 
 * @param  {String} indentation - used to indent program's structure
 * @returns {String}
 */
module.exports = function (request, indentation) {
    // used to check wether body is present in the request or not
    if (request.body) {
        var temp = [],
            temp1 = [],
            body = '',
            list;
        switch (request.body.mode) {
            case 'raw':
                if (!_.isEmpty(request.body[request.body.mode])) {
                    body += `$body->append(\n${JSON.stringify(request.body[request.body.mode])}\n);\n`;
                }
                return body;

            case 'urlencoded':
                list = _.reject(request.body[request.body.mode], 'disabled');
                if (!_.isEmpty(list)) {
                    temp = _.map(list, function (value) {
                        return `'${indentation}${value.key}' => '${value.value}'`;
                    });
                    body = `$body->append(new http\\QueryString(array(\n${temp.join(',\n')}));`;
                }
                return body;

            case 'formdata':
                list = _.reject(request.body[request.body.mode], 'disabled');
                if (!_.isEmpty(list)) {
                    temp = _.map(list, function (value) {
                        if (value.type === 'text' && value.key) {
                            return (`${indentation}'${value.key}' => '${value.value}'`);
                        }
                    });
                    temp1 = _.map(list, function (value) {
                        if (value.type === 'text' && value.key) {
                            return (`${indentation.repeat(2)}array('name' => '${value.value}', 'type' => '${value.type}', 'file' => '${value.src}', 'data' => null)`);
                        }
                    });
                }
                body = `$body->addForm(array(\n${temp.join(',\n')}\n${indentation}),\n${indentation}array(\n${temp1.join(',\n')}\n));\n`;
                return body;

            default:
                return initial;
        }
    }
    return '';
};
