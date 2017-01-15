'use strict';

const expect = require('chai').expect;
const Message = require('../message');
const User = require('../user');
const MessageStore = require('../message_store').create();

describe('Message Store', () => {
    const user1 = new User(1, 'bob', 'Bob');
    const user2 = new User(2, 'jude', 'Jude');

    beforeEach(function () {
        MessageStore.remove_all_messages();
    });
    it('should create a message with a sender and recipient', () => {
        const message = MessageStore.create_message(user1, user2, '');
        expect(MessageStore._messages.length).to.equal(1);
        expect(MessageStore._messages[0]).to.equal(message);
    });
    it('should get the inbox of the given user', () => {
        const message1 = MessageStore.create_message(user1, user2, '');
        const message2 = MessageStore.create_message(user1, user2, '');
        const message3 = MessageStore.create_message(user2, user1, '');
        const message4 = MessageStore.create_message(user2, user2, '');

        expect(MessageStore.get_messages(user2).length).to.equal(3);
    });
});