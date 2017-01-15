'use strict';

const Errors = require('./errors');

class User {
    constructor(id, username, name) {
        if (!username)
            throw Errors.INVALID_USERNAME;
        this.id = id;
        this.username = username;
        this.name = name;
    }

    get_name() {
        if (this.name)
            return this.name;
        return this.username;
    }
}

module.exports = User;