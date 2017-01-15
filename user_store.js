const User = require('./user');
const Errors = require('./errors');

class UserStore {
    constructor() {
        this._next_free_id = 1;
        this._users = [];
    }

    static create() {
        return new UserStore();
    }

    create_user(username, name) {
        const user = new User(this._next_free_id, username, name);
        this._users.push(user);
        this._next_free_id += 1;
        return user;
    }

    register_user(username, name) {
        if (this.is_user_exist(username))
            throw Errors.USERNAME_ALREADY_USED;
        else
            return this.create_user(username, name);
    }

    get_user(identifier, value) {
        for (const user of this._users) {
            if (user[identifier] === value)
                return user;
        }
        throw Errors.USER_DOES_NOT_EXIST;
    }

    is_user_exist(username) {
        if (this._users.find(user => user.username === username) === undefined)
            return false;
        return true;
    }

    remove_all_users() {
        this._users = [];
    }

    get_all_users() {
        return this._users;
    }
}
module.exports = UserStore;