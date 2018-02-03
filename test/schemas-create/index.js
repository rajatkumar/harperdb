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

describe('schemas-create', function() {
    it('should create schema', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: true
        });

        client.createSchema('unittest', (err, data) => {
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

    it('should create Teams table', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: true
        });

        client.createTable(
            {
                table: 'teams',
                schema: 'unittest',
                hash_attribute: 'team_id' // eslint-disable-line camelcase
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

    it('should create Matches table', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: true
        });

        client.createTable(
            {
                table: 'matches',
                schema: 'unittest',
                hash_attribute: 'match_id' // eslint-disable-line camelcase
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
});
