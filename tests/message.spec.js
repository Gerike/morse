'use strict';

const expect = require('chai').expect;
const Message = require('../message');
const User = require('../user');

describe('Message', () => {
    let message;
    const sender = new User(1, 'bob', 'Bob');
    const recipient = new User(2, 'jude', 'Jude');
    const message_text_morse = '.... . -.--   .--- ..- -.. .';
    const message_text_raw = 'HEY JUDE';

    beforeEach(function () {
        message = new Message(sender, recipient, message_text_morse);
    });
    it('should create a message with a sender and recipient', () => {
        expect(message.get_sender_name()).to.equal(sender.get_name());
        expect(message.get_recipient_name()).to.equal(recipient.get_name());
    });
    it('getter should return the message decoded', () => {
        expect(message.get_decoded_message()).to.equal(message_text_raw);
    });
    it('toJSON should return a properly formatted JSON string', () => {
        let json_message = JSON.parse(message.to_json());
        expect(Object.keys(json_message).length).to.equal(3);
        expect(json_message['to']).to.equal(recipient.get_name());
        expect(json_message['from']).to.equal(sender.get_name());
        expect(json_message['message']).to.equal(message_text_raw);

    });
});