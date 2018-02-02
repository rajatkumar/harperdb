'use strict';

// external modules
const assert = require('chai').assert;
const harperdb = require('../lib');

describe('harperdb', function() {
    it('should be awesome', function() {
        assert.equal(5, harperdb.sample(2, 3));
    });
});
