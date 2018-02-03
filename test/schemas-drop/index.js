'use strict';

// external modules
const assert = require('chai').assert;
const logger = require('pino')();
// internal modules
const harperdb = require('../../lib');
const username = 'HDB_ADMIN';
const password = 'admin';
const host = 'http://localhost';
const port = '9925';

describe('schemas-remove', function() {
    it('should drop Teams table', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: true
        });

        client.dropTable(
            {
                table: 'teams',
                schema: 'unittest'
            },
            (err, data) => {
                logger.info(err, data);
                if (err) {
                    return done(err);
                } else {
                    assert.isObject(data);
                    assert.property(data, 'message');
                    return done();
                }
            }
        );
    });

    it('should drop Matches table', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: true
        });

        client.dropTable(
            {
                table: 'matches',
                schema: 'unittest'
            },
            (err, data) => {
                logger.info(err, data);
                if (err) {
                    return done(err);
                } else {
                    assert.isObject(data);
                    assert.property(data, 'message');
                    return done();
                }
            }
        );
    });

    it('should drop schema', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: true
        });

        client.dropSchema('unittest', (err, data) => {
            logger.info(err, data);
            if (err) {
                return done(err);
            } else {
                assert.isObject(data);
                assert.property(data, 'message');
                return done();
            }
        });
    });
});
