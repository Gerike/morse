'use strict';

const codeTable = require('./code_table');
const serviceCodes = require('./service_codes');

class Morse {

    static decode(morseMessage) {
        let messageWords = [];
        const morseWords = this.getWords(this.trimMorseMessage(morseMessage));
        for (const morseWord of morseWords) {
            messageWords.push(this.convertWord(morseWord));
        }
        return messageWords.join(' ');
    }

    static trimMorseMessage(morseMessage) {
        return morseMessage.trim()
    }

    static getWords(morseMessage) {
        return morseMessage.split('   ');
    }


    static convertWord(morseWord) {
        let word = '';
        const expressions = morseWord.split(' ');
        for (const exp of expressions) {
            word += this.convertExpression(exp);
        }
        return word;
    }

    static convertExpression(morseExpression) {
        if (morseExpression in serviceCodes)
            return serviceCodes[morseExpression];
        else if (morseExpression in codeTable)
            return codeTable[morseExpression];
        else
            return '';
    }
}

module.exports = Morse;
