'use strict';

function userInfo() {
    return {
        body: {
            operation: 'user_info'
        },
        path: '/'
    };
}

function sql(sqlStmt) {
    return {
        body: {
            operation: 'sql',
            sql: sqlStmt
        },
        path: '/'
    };
}

function createSchema(schema) {
    return {
        body: {
            operation: 'create_schema',
            schema
        },
        path: '/'
    };
}

function dropSchema(schema) {
    return {
        body: {
            operation: 'drop_schema',
            schema
        },
        path: '/'
    };
}

function describeSchema(schema) {
    return {
        body: {
            operation: 'describe_schema',
            schema
        },
        path: '/'
    };
}
// eslint-disable-next-line camelcase
function createTable(schema, table, hash_attribute) {
    return {
        body: {
            operation: 'create_table',
            schema,
            table,
            hash_attribute // eslint-disable-line camelcase
        },
        path: '/'
    };
}

function describeTable(schema, table) {
    return {
        body: {
            operation: 'describe_table',
            schema,
            table
        },
        path: '/'
    };
}

function dropTable(schema, table) {
    return {
        body: {
            operation: 'drop_table',
            schema,
            table
        },
        path: '/'
    };
}

function describeAll() {
    return {
        body: {
            operation: 'describe_all'
        },
        path: '/'
    };
}

module.exports = {
    userInfo,
    sql,
    createSchema,
    dropSchema,
    describeSchema,
    createTable,
    dropTable,
    describeTable,
    describeAll
};
