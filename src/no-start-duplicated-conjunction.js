// LICENSE : MIT
"use strict";
import {RuleHelper, IgnoreNodeManager} from "textlint-rule-helper";
import ObjectAssign from "object-assign";
const splitSentence = require("sentence-splitter").split;
const SentenceSyntax = require("sentence-splitter").Syntax;
const defaultOptions = {
    interval: 2
};
const punctuation = /[。\n]/;
const pointing = /[、,]/;
function splitBySentence(text) {
    return text.split(punctuation);
}
// conjunction
function getFirstPhrase(sentence) {
    var phrases = sentence.value.split(pointing);
    if (phrases.length > 0) {
        return phrases[0].trim();
    }
}
module.exports = function (context, options = {}) {
    options = ObjectAssign({}, defaultOptions, options);
    const helper = new RuleHelper(context);
    const ignoreNodeManager = new IgnoreNodeManager();
    const {Syntax, getSource, report, RuleError} = context;
    let previousPhases = [];
    let useDuplicatedPhase = false;
    return {
        [Syntax.Paragraph](node){
            const ignoreTypes = [Syntax.Code, Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis];
            if (helper.isChildNode(node, ignoreTypes)) {
                return;
            }
            ignoreNodeManager.ignoreChildrenByTypes(node, ignoreTypes);
            const text = getSource(node);
            const sentences = splitSentence(text, {
                charRegExp: /[。\?\!？！]/
            }).filter(sentence => {
                return sentence.type === SentenceSyntax.Sentence;
            });
            sentences.forEach(sentence => {
                const phrase = getFirstPhrase(sentence);
                if (phrase.length === 0) {
                    return;
                }
                if (previousPhases.indexOf(phrase) !== -1) {
                    useDuplicatedPhase = true;
                }
                if (useDuplicatedPhase) {
                    if (ignoreNodeManager.isIgnoredRange(sentence.range)) {
                        return;
                    }
                    report(node, new RuleError(`don't repeat "${phrase}" in ${options.interval} phrases`, {
                        line: Math.max(sentence.loc.start.line - 1, 0),
                        column: sentence.loc.start.column
                    }));
                    useDuplicatedPhase = false;
                }
                // add first item
                previousPhases.unshift(phrase);
                previousPhases = previousPhases.slice(0, options.interval);
            });
        }
    }
};