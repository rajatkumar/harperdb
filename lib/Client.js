'use strict';

// external modules
const httpClient = require('restify-clients');
const EventEmitter = require('events');

// Class definition
class Client extends EventEmitter {
    constructor(opts) {
        //TODO validate the options
        super();
        this.opts = opts;
        this.state = {
            connected: false,
            users: {}
        };
        this.reqOptions = {
            connectTimeout: opts.connectTimeout || 30000,
            requestTimeout: opts.requestTimeout || 30000
        };
        const client = httpClient.createJsonClient({
            url: `${opts.host}:${opts.port}`
        });
        client.basicAuth(opts.username, opts.password);

        this.username = opts.username;
        this.httpClient = client;
        if (opts.autoverify) {
            this.connect();
        }
    }

    connect(done) {
        const command = {
            operation: 'user_info'
        };

        const { connectTimeout, requestTimeout } = this.reqOptions;

        this.httpClient.post(
            {
                path: '/',
                connectTimeout,
                requestTimeout
            },
            command,
            (err, req, res, data) => {
                if (err) {
                    this.emit('connection:failure', err);
                    return done(err);
                }

                const { username, active } = data;
                if (username === this.username) {
                    this.state.users[username] = {
                        active
                    };
                    this.state.connected = true;
                }

                this.emit('connection:success');
                return done(null, this.state);
            }
        );
    }

    getCurrentState() {
        let response = {
            connected: false
        };
        if (this.state.connected) {
            response = this.state;
        }
        return response;
    }
}

module.exports = Client;
