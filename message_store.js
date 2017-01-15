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

    messages_to_json(messages){
        let response = '[';
        for (let i = 0; i < messages.length - 1; i++) {
            response += message[0].to_json() + ',';
        }
        if(messages.length > 0){
            response += messages[messages.length - 1].to_json()
        }
        response += ']';
        return response;
    }
}

module.exports = MessageStore;
