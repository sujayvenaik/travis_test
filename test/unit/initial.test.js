var expect = require('chai').expect,
    fs = require('fs'),
    sdk = require('postman-collection'),
    exec = require('shelljs').exec,
    newman = require('newman'),
    parallel = require('async').parallel,

    convert = require('../../lib/index'),
    mainCollection = require('../unit/fixtures/sample_collection.json');

    // properties and headers to delete from newman reponse and cli response
const propertiesTodelete = ['cookies', 'headersSize', 'startedDateTime'],
    headersTodelete = [
        'accept-encoding',
        'user-agent',
        'cf-ray',
        'x-request-id',
        'x-request-start',
        'connect-time',
        'x-forwarded-for',
        'content-type',
        'content-length',
        'accept',
        'cookie',
        'total-route-time'
    ];

/**
 * Executes codesnippet and compares output with newman response
 * 
 * @param {String} codeSnippet - code snippet from convert function
 * @param {Object} collection - sample collection
 * @param {Function} done - callback for async calls
 */
function runSnippet (codeSnippet, collection, done) {
    fs.writeFile('test/unit/fixtures/codesnippet.php', codeSnippet, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        parallel([
            function (callback) {
                exec('php test/unit/fixtures/codesnippet.php', function (err, stdout, stderr) {
                    if (err) {
                        return callback(err);
                    }
                    if (stderr) {
                        return callback(stderr);
                    }

                    try {
                        stdout = JSON.parse(stdout);
                    }
                    catch (e) {
                        console.error(e);
                    }
                    callback(null, stdout);
                });
            },
            function (callback) {
                newman.run({
                    collection: collection
                }).on('request', function (err, summary) {
                    if (err) {
                        return callback(err);
                    }

                    var stdout = summary.response.stream.toString();
                    try {
                        stdout = JSON.parse(stdout);
                    }
                    catch (e) {
                        console.error(e);
                    }
                    callback(null, stdout);
                });
            }
        ], function (err, result) {
            if (err) {
                console.log(err);
            }
            else if (typeof result[1] !== 'object' && typeof result[0] !== 'object') {
                expect(result[0].trim()).to.equal(result[1].trim());
            }
            else {
                if (result[0]) {
                    propertiesTodelete.forEach(function (property) {
                        delete result[0][property];
                    });
                    if (result[0].headers) {
                        headersTodelete.forEach(function (property) {
                            delete result[0].headers[property];
                        });
                    }
                    if(result[0].url) {
                        result[0].url = unescape(result[0].url);
                    }
                }
                if (result[1]) {
                    propertiesTodelete.forEach(function (property) {
                        delete result[1][property];
                    });
                    if (result[1].headers) {
                        headersTodelete.forEach(function (property) {
                            delete result[1].headers[property];
                        });
                    }
                    if(result[1].url) {
                        result[1].url = unescape(result[1].url);
                    }
                }
                console.log(result[0]);
                console.log(result[1]);
                
                expect(result[0]).deep.equal(result[1]);
            }
            done();
        });
    });
}

describe('Curl converter', function () {
    mainCollection.item.forEach(function (item) {
        it(item.name, function (done) {
            var request = new sdk.Request(item.request),
                collection = {
                    item: [
                        {
                            request: request.toJSON()
                        }
                    ]
                };
            convert.convert(request, {indentType: 'spapce', 
                indentCount: 4,
                requestTimeout: 100,
                requestBodyTrim: false,
                addCacheHeader: false,
                followRedirect: true}, function (err, snippet) {
                if (err) {
                    console.error(err);
                }
                runSnippet(snippet, collection, done);
            });

        }).timeout(10000);
    });
});
