'use strict';

// external modules
const assert = require('chai').assert;

// internal modules
const harperdb = require('../../lib');
const username = 'HDB_ADMIN';
const password = 'admin';
const host = 'http://localhost';
const port = '9925';
const logger = require('pino')();

/* eslint-disable no-console */

describe('connection', function() {
    it('should connect automatically', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: true
        });

        client.on('connection:success', function() {
            const state = client.getCurrentState();
            // must be connected
            assert.isTrue(state.connected);
            // must have the user info available
            assert.isOk(state.users[username]);
            done();
        });

        client.on('connection:failure', function(err) {
            done(err);
        });
    });

    it('should lazy connect', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: false
        });

        client.connect((err, state) => {
            // no errors
            assert.isNull(err);
            // must be connected
            assert.isTrue(state.connected);
            // must have the user info available
            assert.isOk(state.users[username]);
            done();
        });
    });

    it('should error on invalid user', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username: 'DrDrake',
            password,
            autoverify: false
        });

        client.connect((err, state) => {
            logger.info(err);
            // assert it throws Error
            assert.isNotNull(err);
            assert.equal(err.name, 'UnauthorizedError');
            done();
        });
    });

    it('should error on invalid password', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password: 'invalidofcourse',
            autoverify: false
        });

        client.connect((err, state) => {
            logger.info(err);
            // assert it throws Error
            assert.isNotNull(err);
            assert.equal(err.name, 'UnauthorizedError');
            done();
        });
    });

    it.skip('should error out unavailable server', function(done) {
        this.timeout(17000);
        // it is important to understand that we retry 3 times
        const client = harperdb.createClient({
            host,
            port: '9909',
            username,
            password,
            autoverify: false,
            connectTimeout: 5000,
            requestTimeout: 5000
        });

        client.connect((err, state) => {
            logger.info(err);
            // assert it throws Error
            assert.isNotNull(err);
            done();
        });
    });
});

/* eslint-enable no-console */
