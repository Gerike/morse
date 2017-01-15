'use strict';

const expect = require('chai').expect;
const User = require('../user');
const Errors = require('../errors');

describe('User', () => {
    const username = 'alice';
    const name = 'Alice Green';
    const id = 1;

    it('should create a user', () => {
        const user = new User(id, username, name);
        expect(user.name).to.equal(name);
        expect(user.username).to.equal(username);
    });

    it('should fail when trying to create a user without username', () => {
        expect(() => {
            new User(id, '', name)
        }).to.throw(Errors.INVALID_USERNAME);
    });

    it('should get the username if long name does not defined', () => {
        const user = new User(id, username, '');
        expect(user.get_name()).to.equal(username);
    });
    it('should get the long name if the long name and username both defined', () => {
        const user = new User(id, username, name);
        expect(user.get_name()).to.equal(name);
    });
});