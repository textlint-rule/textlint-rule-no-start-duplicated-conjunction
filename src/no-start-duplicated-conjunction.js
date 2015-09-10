// LICENSE : MIT
"use strict";
import ObjectAssign from "object-assign"
const defaultOptions = {
    max: 2
};
const punctuation = /[。\?]/;
const pointing = /[、,]/;
function splitBySentence(text) {
    return text.split(punctuation);
}
function getFirstPhrase(sentence) {
    var phrases = sentence.split(pointing);
    if (phrases.length > 0) {
        return phrases[0].trim();
    }
}
export default function (context, options = {}) {
    options = ObjectAssign({}, defaultOptions, options);
    let {Syntax,getSource, report,RuleError} = context;
    var previousPhases = [];
    var useDuplicatedPhase = false;
    return {
        [Syntax.Paragraph](node){
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
                    report(node, new RuleError(`don't repeat "${phrase}" in ${options.max} phrases`));
                    useDuplicatedPhase = false;
                }
                // add first item
                previousPhases.unshift(phrase);
                previousPhases = previousPhases.slice(0, options.max);
            });
        }
    }
}