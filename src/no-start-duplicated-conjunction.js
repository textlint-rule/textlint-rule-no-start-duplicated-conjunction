// LICENSE : MIT
"use strict";
import {RuleHelper, IgnoreNodeManager} from "textlint-rule-helper";
import ObjectAssign from "object-assign";
const splitSentence = require("sentence-splitter").split;
const SentenceSyntax = require("sentence-splitter").Syntax;
const defaultOptions = {
    interval: 2
};
const pointing = /[、,]/;
// conjunction
function getFirstPhrase(sentence) {
    var phrases = sentence.value.split(pointing);
    if (phrases.length > 0) {
        return phrases[0].trim();
    }
}
module.exports = function(context, options = {}) {
    options = ObjectAssign({}, defaultOptions, options);
    const helper = new RuleHelper(context);
    const ignoreNodeManager = new IgnoreNodeManager();
    const {Syntax, getSource, report, RuleError} = context;
    let previousPhases = [];
    let useDuplicatedPhase = false;
    return {
        // reset count
        [Syntax.Header](){
            previousPhases = [];
        },
        [Syntax.HorizontalRule](){
            previousPhases = []
        },
        [Syntax.Paragraph](node){
            // FIXME: linkReference should be defined in TxtAST.
            const ignoreTypes = [
                Syntax.Code, Syntax.Link, "linkReference", Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis
            ];
            if (helper.isChildNode(node, ignoreTypes)) {
                return;
            }
            ignoreNodeManager.ignoreChildrenByTypes(node, ignoreTypes);
            const text = getSource(node);
            const sentences = splitSentence(text, {
                charRegExp: /[。]/
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
                    const sentenceStartIndex = node.range[0] + sentence.range[0];
                    if (!ignoreNodeManager.isIgnoredIndex(sentenceStartIndex)) {
                        report(node, new RuleError(`Don't repeat "${phrase}" in ${options.interval} phrases`, {
                            line: Math.max(sentence.loc.start.line - 1, 0),
                            column: sentence.loc.start.column
                        }));
                    }
                    useDuplicatedPhase = false;
                }
                // add first item
                previousPhases.unshift(phrase);
                previousPhases = previousPhases.slice(0, options.interval);
            });
        }
    }
};