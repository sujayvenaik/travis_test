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
                    body += `$body->append('${request.body[request.body.mode]}');\n`;
                }
                return body;

            case 'urlencoded':
                list = _.reject(request.body[request.body.mode], 'disabled');
                if (!_.isEmpty(list)) {
                    temp = _.map(list, function (value) {
                        return `${indentation}'${value.key.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}' => '${value.value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`;
                    });
                    body = `$body->append(new http\\QueryString(array(\n${temp.join(',\n')})));`;
                }
                return body;

            case 'formdata':
                list = _.reject(request.body[request.body.mode], 'disabled');
                if (!_.isEmpty(list)) {
                    temp = _.map(_.filter(list,{'type': 'text'}), function (value) {
                            return (`${indentation}'${value.key.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}' => '${value.value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`);
                    });
                    temp1 = _.map(_.filter(list,{'type': 'file'}), function (value) {
                            return (`${indentation.repeat(2)}array('name' => '${value.value.replace(/'/g, '\\\'')}', 'type' => '${value.type.replace(/'/g, '\\\'')}', 'file' => '${value.src.replace(/'/g, '\\\'')}', 'data' => null)`);
                        });
                    body = `$body->addForm(array(\n${temp.join(',\n')}\n), NULL);\n`;
                    // body = `$body->addForm(array(\n${temp.join(',\n')}\n${indentation}),\n${indentation}array(\n${temp1.join(',\n')}\n));\n`;
                }
                return body;

            default:
                return initial;
        }
    }
    return '';
};
