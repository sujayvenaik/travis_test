var expect = require('chai').expect,
    newman = require('newman'),
    shelljs = require('shelljs'),
    sdk = require('postman-collection'),
    fs = require('fs'),
    async = require('async'),
    convert = require('../../lib');

describe('Request snippet', function () {
    it('should compare the output of the request from newman', function (finish) {
        var collection = new sdk.Collection(JSON.parse(fs.readFileSync('test/unit/fixtures/sample_collection.json').toString())),
            outputScript = '',
            outputNewman = '',
            request = collection.items.members[0].request;
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
            // function (done) {
            //     console.log('writing file');
            //     console.log(snippet);
            //     fs.writeFile('test/unit/fixtures/codefile.rb', snippet, function (err) {
            //         if (err) {
            //             return done(err);
            //         }
            //         done(null);
            //     });
            // },
            function (done) {
                console.log('execute');
                outputScript = shelljs.exec('ruby test/unit/fixtures/codefile.rb', {silent: true});
                console.log(outputScript);
                console.log('------');
                // console.log(JSON.parse(outputNewman));
                expect(1).to.be.a('number');
                done(null);
            },
            function (done) {
                console.log(outputScript);
                console.log('check');   
                outputNewman = JSON.parse(outputNewman);
                delete outputNewman.headers['user-agent'];
                delete outputNewman.headers['accept-encoding'];
                delete outputNewman.headers['accept'];
                outputScript = JSON.parse(outputScript.stdout);
                delete outputScript.headers['accept-encoding'];
                delete outputScript.headers['user-agent'];
                console.log(outputNewman);
                console.log(outputNewman);
                // expect(1).to.be.a('number');
                expect(outputNewman).to.deep.equal(outputScript);
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
    }).timeout(10000000);
});
