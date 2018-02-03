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

describe('sql', function() {
    it('should insert into Teams table', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: false
        });

        client.runSql(
            'INSERT INTO unittest.teams (team_id, name, star_player) ' +
                "VALUES (1, 'Arsenal', 'Ozil'), " +
                "(2, 'Manchester United', 'Lukaku')," +
                "(3, 'Everton', 'Rooney')",
            (err, data) => {
                logger.info(data);
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

    it('should insert into Matches table', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: false
        });

        client.runSql(
            'INSERT INTO unittest.matches' +
                ' (match_id, home_team_id, away_team_id) VALUES ' +
                '(1, 1, 3), ' +
                '(2, 3, 2),' +
                '(3, 2, 1)',
            (err, data) => {
                logger.info(data);
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

    it('should run select statement', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: false
        });

        client.runSql('SELECT * FROM unittest.teams', (err, data) => {
            logger.info(data);
            if (err) {
                return done(err);
            } else {
                assert.isArray(data);
                assert.equal(data.length, 3);
                return done();
            }
        });
    });

    it('should fail on invalid select statement', function(done) {
        const client = harperdb.createClient({
            host,
            port,
            username,
            password,
            autoverify: false
        });

        client.runSql('SELECT *  unittest.teams', (err, data) => {
            assert.isNotNull(err);
            logger.info(err.body);
            done();
        });
    });
});
