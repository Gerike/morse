'use strict';

const Errors = require('./errors');

class SessionStore {
    constructor() {
        this._sessions = {};
        this._tokenParts = 'QWERTZUIOPASDFGHJKLYXCVBNM123456789';
        this._tokenLength = 10;
    }

    static create() {
        return new SessionStore();
    }

    _create_token() {
        let token = '';
        for (let i = 0; i < this._tokenLength; i++) {
            token += this._tokenParts[Math.floor(Math.random() * this._tokenParts.length)];
        }
        return token;
    }

    create_session_token() {
        let token = '';
        do {
            token = this._create_token();
        } while (token in Object.keys(this._sessions));
        return token;
    }

    get_user_id(token) {
        if (token in this._sessions)
            return this._sessions[token];
        throw Errors.TOKEN_DOES_NOT_EXIST;
    }

    validate_user_token(user, token) {
        if (token in this._sessions) {
            if (this._sessions[token] === user.id)
                return this._sessions[token];
            else
                throw Errors.TOKEN_MISMATCH;
        }
        else
            throw Errors.TOKEN_DOES_NOT_EXIST;
    }

    create_session(user) {
        const token = this.create_session_token();
        this._sessions[token] = user.id;
        return token;
    }

    remove_all_sessions() {
        this._sessions = {};
    }

    get_all_sessions() {
        return this._sessions;
    }
}

module.exports = SessionStore;