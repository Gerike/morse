'use strict';

const expect = require('chai').expect;
const UserStore = require('../user_store').create();
const Errors = require('../errors');

describe('User Store', () => {
    let user;
    beforeEach(function () {
        UserStore.remove_all_users();
        user = UserStore.register_user('alice', 'Alice Green');
    });

    it('should create a user with a given username and name', () => {
        expect(user.id).to.be.at.least(1);
        expect(user.name).to.equal(user.name);
        expect(user.username).to.equal(user.username);
        expect(UserStore.get_all_users().length).to.equal(1);
        expect(UserStore.get_all_users()[0]).to.equal(user);
    });

    it('should fail when creating a user if the username already exist', () => {
        expect(() => {
            UserStore.register_user(user.username, '')
        }).to.throw(Errors.USERNAME_ALREADY_USED);
    });
    it('should get a user if it exists', () => {
        const g_user = UserStore.get_user('username', user.username);
        expect(g_user).to.equal(user);
    });
    it('should fail getting a user if it does not exist', () => {
        expect(() => {UserStore.get_user('username', 'not_exist')}).to.throw(Errors.USER_DOES_NOT_EXIST);
    });
});