'use strict';

// external modules
const EventEmitter = require('events');

// internal modules
const HarperCommands = require('./HarperCommands');
const HttpClient = require('./HttpClient');

const defaultState = {
    connected: false,
    users: {}
};

// Class definition
class Client extends EventEmitter {
    constructor(opts) {
        //TODO validate the options
        super();
        // client maintains a very basic state
        this.state = Object.assign({}, defaultState, {
            username: opts.username
        });
        // instantiate the communication channel
        this.HarperDB = new HttpClient({
            host: opts.host,
            port: opts.port,
            username: opts.username,
            password: opts.password,
            transportOptions: {
                connectTimeout: opts.connectTimeout,
                requestTimeout: opts.requestTimeout
            }
        });
        if (opts.autoverify) {
            this.connect(() => ({}));
        }
    }

    connect(done) {
        this.HarperDB.invokeCommand(HarperCommands.userInfo(), (err, data) => {
            if (err) {
                this.emit('connection:failure', err);
                return done(err);
            }

            const { username, active } = data;
            if (username === this.state.username) {
                this.state.users[username] = {
                    active
                };
                this.state.connected = true;
            }

            this.emit('connection:success');
            return done(null, this.state);
        });
    }

    runSql(sqlStatement, done) {
        this.HarperDB.invokeCommand(
            HarperCommands.sql(sqlStatement),
            (err, data) => {
                if (err) {
                    this.emit('sql:err', err);
                    return done(err);
                }
                this.emit('sql:result', data);
                return done(null, data);
            }
        );
    }

    createSchema(schema, done) {
        this.HarperDB.invokeCommand(
            HarperCommands.createSchema(schema),
            (err, data) => {
                if (err) {
                    this.emit('schema.create:err', err);
                    return done(err);
                }
                this.emit('schema.create:result', data);
                return done(null, data);
            }
        );
    }

    describeSchema(schema, done) {
        this.HarperDB.invokeCommand(
            HarperCommands.describeSchema(schema),
            (err, data) => {
                if (err) {
                    this.emit('schema.desc:err', err);
                    return done(err);
                }
                this.emit('schema.desc:result', data);
                return done(null, data);
            }
        );
    }

    dropSchema(schema, done) {
        this.HarperDB.invokeCommand(
            HarperCommands.dropSchema(schema),
            (err, data) => {
                if (err) {
                    this.emit('schema.drop:err', err);
                    return done(err);
                }
                this.emit('schema.drop:result', data);
                return done(null, data);
            }
        );
    }
    // eslint-disable-next-line camelcase
    createTable({ schema, table, hash_attribute }, done) {
        this.HarperDB.invokeCommand(
            HarperCommands.createTable(schema, table, hash_attribute),
            (err, data) => {
                if (err) {
                    this.emit('table.create:err', err);
                    return done(err);
                }
                this.emit('table.create:result', data);
                return done(null, data);
            }
        );
    }

    dropTable({ schema, table }, done) {
        this.HarperDB.invokeCommand(
            HarperCommands.dropTable(schema, table),
            (err, data) => {
                if (err) {
                    this.emit('table.drop:err', err);
                    return done(err);
                }
                this.emit('table.drop:result', data);
                return done(null, data);
            }
        );
    }

    describeTable({ schema, table }, done) {
        this.HarperDB.invokeCommand(
            HarperCommands.describeTable(schema, table),
            (err, data) => {
                if (err) {
                    this.emit('table.desc:err', err);
                    return done(err);
                }
                this.emit('table.desc:result', data);
                return done(null, data);
            }
        );
    }

    getCurrentState() {
        let response = defaultState;
        if (this.state.connected) {
            response = this.state;
        }
        return response;
    }
}

module.exports = Client;
