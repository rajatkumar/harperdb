'use strict';
const Client = require('./Client');

function createClient(opts) {
    return new Client(opts);
}

module.exports = {
    createClient
};
