'use strict';

const Message = require('./message');

class MessageStore {
    constructor() {
        this._messages = [];
    }

    static create() {
        return new MessageStore();
    }

    create_message(sender, recipient, text) {
        const message = new Message(sender, recipient, text);
        this._messages.push(message);
        return message;
    }

    get_messages(user) {
        return this._messages.filter((message) => {
            return message.recipient.username === user.username
        });
    }

    remove_all_messages() {
        this._messages = [];
    }

}

module.exports = MessageStore;
