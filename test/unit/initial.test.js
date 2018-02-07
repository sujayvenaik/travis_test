var expect = require('chai').expect,
    newman = require('newman'),
    shelljs = require('shelljs'),
    sdk = require('postman-collection'),
    fs = require('fs'),
    async = require('async'),
    convert = require('../../lib');

describe('Request snippet', function () {
    it('should compare the output of the request from newman', function (finish) {
        var request = new sdk.Request({
                'method': 'POST',
                'header': [
                    {
                        'key': '1',
                        'value': 'a'
                    },
                    {
                        'key': '2',
                        'value': 'b'
                    }
                ],
                'body': {},
                'url': {
                    'raw': 'https://postman-echo.com/post?pm=0&postman=1',
                    'protocol': 'https',
                    'host': [
                        'postman-echo',
                        'com'
                    ],
                    'path': [
                        'post'
                    ],
                    'query': [
                        {
                            'key': 'pm',
                            'value': '0',
                            'equals': true
                        },
                        {
                            'key': 'postman',
                            'value': '1',
                            'equals': true
                        }
                    ]
                },
                'description': ''
            }),
            outputScript = '',
            outputNewman = '',
            snippet = convert(request, {indentType: 'tab', indentCount: 1});

        async.series([
            function (done) {
                console.log('newman');
                newman.run({
                    collection: require('../unit/fixtures/sample_collection.json')
                }).on('start', function (err) { // on start of run, log to console
                    if (err) {
                        console.error('error');
                    }
                }).on('done', function (err, summary) {
                    if (err || summary.error) {
                        console.error('collection run encountered an error.');
                    }
                    else {
                        outputNewman = summary.run.executions[0].response.stream.toString();
                        done(null);
                    }
                });
            },
            function (done) {
                console.log('1');
                fs.writeFile('test/unit/fixtures/codesnippet.php', snippet, function (err) {
                    if (err) {
                        return done(err);
                    }
                    done(null);
                });
            },
            function (done) {
                console.log('2');
                outputScript = shelljs.exec('php test/unit/fixtures/codesnippet.php', {silent: true});
                done(null);
            },
            function (done) {
                console.log('3');
                outputNewman = JSON.parse(outputNewman);
                delete outputNewman.headers['user-agent'];
                expect(outputNewman).to.deep.equal(JSON.parse(outputScript.stdout));
                done(null);
            }
        ], function (err) {
            if (err) {
                console.log('in error');
            }
            else {
                console.log('no Error');
                finish();
            }
        });
    }).timeout(10000);
});
