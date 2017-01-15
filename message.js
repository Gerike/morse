'use strict';

const Morse = require('./Morse');

class Message {
    constructor(sender, recipient, morse) {
        this.sender = sender;
        this.recipient = recipient;
        this.message = morse;
    }

    get_sender_name() {
        return this.sender.get_name();
    }

    get_recipient_name() {
        return this.recipient.get_name();
    }

    get_decoded_message() {
        return Morse.decode(this.message);
    }

    to_json() {
        return JSON.stringify({
            'from': this.get_sender_name(),
            'to': this.get_recipient_name(),
            'message': this.get_decoded_message(),
        });
    }
}

module.exports = Message;