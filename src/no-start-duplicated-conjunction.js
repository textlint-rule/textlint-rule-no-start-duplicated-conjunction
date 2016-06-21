// LICENSE : MIT
"use strict";
import {RuleHelper} from "textlint-rule-helper";
import ObjectAssign from "object-assign";
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
    var phrases = sentence.split(pointing);
    if (phrases.length > 0) {
        return phrases[0].trim();
    }
}
module.exports = function (context, options = {}) {
    options = ObjectAssign({}, defaultOptions, options);
    let helper = new RuleHelper(context);
    let {Syntax, getSource, report, RuleError} = context;
    var previousPhases = [];
    var useDuplicatedPhase = false;
    return {
        [Syntax.Paragraph](node){
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }
            var text = getSource(node);
            var sentences = splitBySentence(text);
            sentences.forEach(sentence => {
                var phrase = getFirstPhrase(sentence);
                if (phrase.length === 0) {
                    return;
                }
                if (previousPhases.indexOf(phrase) !== -1) {
                    useDuplicatedPhase = true;
                }

                if (useDuplicatedPhase) {
                    report(node, new RuleError(`don't repeat "${phrase}" in ${options.interval} phrases`));
                    useDuplicatedPhase = false;
                }
                // add first item
                previousPhases.unshift(phrase);
                previousPhases = previousPhases.slice(0, options.interval);
            });
        }
    }
}