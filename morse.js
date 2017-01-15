'use strict';

const code_table = require('./code_table');
const service_codes = require('./service_codes');

class Morse {

    static decode(morse_message) {
        let message_words = [];
        const morse_words = this.get_words(this.trim_morse_message(morse_message));
        for (const morse_word of morse_words) {
            message_words.push(this.convert_word(morse_word));
        }
        return message_words.join(' ');
    }

    static trim_morse_message(morse_message) {
        return morse_message.trim()
    }

    static get_words(morse_message) {
        return morse_message.split('   ');
    }

    static convert_expression(morse_expression) {
        if (morse_expression in service_codes)
            return service_codes[morse_expression];
        else if (morse_expression in code_table)
            return code_table[morse_expression];
        else
            return '';
    }

    static convert_word(morse_word) {
        let word = '';
        const expressions = morse_word.split(' ');
        for (const exp of expressions) {
            word += this.convert_expression(exp);
        }
        return word;
    }
}

module.exports = Morse;
