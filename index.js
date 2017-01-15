'use strict';

const Errors = require('./errors');
const MessageStore = require('./message_store').create();
const SessionStore = require('./session_store').create();
const UserStore = require('./user_store').create();
const bodyParser = require('body-parser');

let express = require('express');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

function error_handler(err, req, res, next) {
    let status;
    switch (err) {
        case Errors.INVALID_USERNAME:
        case Errors.USERNAME_ALREADY_USED:
            status = 400;
            break;
        case Errors.TOKEN_DOES_NOT_EXIST:
            status = 401;
            break;
        case Errors.TOKEN_MISMATCH:
            status = 403;
            break;
        case Errors.USER_DOES_NOT_EXIST:
            status = 404;
            break;
        default:
            status = 500;
    }
    res.status(status).send({"error": err});
}

app.get('/users/:username/messages', function (req, res) {
    const user = UserStore.get_user('username', req.params.username);
    SessionStore.validate_user_token(user, req.header('X-Auth'));
    const messages = MessageStore.get_messages(user);
    let response = '[';
    for (let i = 0; i < messages.length - 1; i++) {
        response += message[0].to_json() + ',';
    }
    response += ']';
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(response);
});

app.post('/users', function (req, res) {
    const user = UserStore.register_user(req.body.username, req.body.name);
    const token = SessionStore.create_session(user);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({'token': token});
});

app.post('/users/:username/messages', function (req, res) {
    const auth_token = req.header('X-Auth');
    const sender = UserStore.get_user('id', SessionStore.get_user_id(auth_token));
    const recipient = UserStore.get_user('username', req.params.username);

    MessageStore.create_message(sender, recipient, req.body.message);
    res.setHeader('Content-Type', 'application/json');
    res.status(202).send();
});

app.use(error_handler);

app.listen(3000, function () {
    console.log('Messaging service is listening on port ', this.address().port);
});

module.exports = app;