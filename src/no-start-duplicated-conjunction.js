// LICENSE : MIT
"use strict";
const defaultOptions = {
    max: 2
};
const punctuation = /[。.?]/;
const pointing = /[、,]/;
function splitBySentence(text) {
    return text.split(punctuation);
}
function getFirstPhase(sentence) {
    var phases = sentence.split(pointing);
    if (phases.length > 0) {
        return phases[0].trim();
    }
}
export default function (context, options = defaultOptions) {
    let {Syntax,getSource, report,RuleError} = context;
    var previousPhases = [];
    var useDuplicatedPhase = false;
    return {
        [Syntax.Paragraph](node){
            var text = getSource(node);
            var sentences = splitBySentence(text);
            sentences.forEach(sentence => {
                var phase = getFirstPhase(sentence);
                if (previousPhases.indexOf(phase) !== -1) {
                    useDuplicatedPhase = true;
                }

                if (useDuplicatedPhase) {
                    report(node, new RuleError(`don't repeat "${phase}" >= ${options.max}`));
                }
                // add first item
                previousPhases.unshift(phase);
                previousPhases = previousPhases.slice(0, options.max);
            });
        }
    }
}