'use strict';

const httpClient = require('restify-clients');
const logger = require('pino')({
    level: process.env.LOG_LEVEL || 'silent',
    extreme: true
});

class HttpClient {
    constructor({ host, port, username, password, transportOptions }) {
        // construct restify client
        const client = httpClient.createJsonClient({
            url: `${host}:${port}`
        });
        client.basicAuth(username, password);
        // this is the instance
        this.httpClient = client;
        // save the http Options
        this.httpOptions = {
            connectTimeout: transportOptions.connectTimeout,
            requestTimeout: transportOptions.requestTimeout
        };
    }

    invokeCommand(command, callback) {
        const { path, body } = command;
        const postOptions = Object.assign({ path }, this.httpOptions);

        this.httpClient.post(postOptions, body, (err, req, res, data) => {
            logger.info(err, data);
            return callback(err, data);
        });
    }
}

module.exports = HttpClient;
