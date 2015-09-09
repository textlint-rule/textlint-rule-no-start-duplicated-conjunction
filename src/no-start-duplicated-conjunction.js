// LICENSE : MIT
"use strict";
const defaultOptions = {
    max: 2
};
const punctuation = /[。.]/;
const pointing = /[、,]/;
function splitBySentence(text) {
    return text.split(punctuation);
}
function getFirstPhase(sentence) {
    var phases = sentence.split(pointing);
    if (phases.length > 0) {
        return phases[0];
    }
}
export default function (context, options = defaultOptions) {
    let {Syntax,getSource, report,RuleError} = context;
    var previousPhase = null;
    var count = 0;
    return {
        [Syntax.Paragraph](node){
            var text = getSource(node);
            var sentences = splitBySentence(text);
            sentences.forEach(sentence => {
                var phase = getFirstPhase(sentence);
                if (phase == previousPhase) {
                    count++;
                } else {
                    count = 0;
                }
                if (count => options.max) {
                    report(node, new RuleContext(`don't repeat ${phase} >= ${options.max}`));
                }
                previousPhase = phase;
            });
        }
    }
}