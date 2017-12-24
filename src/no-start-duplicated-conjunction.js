// LICENSE : MIT
"use strict";
import { RuleHelper, IgnoreNodeManager } from "textlint-rule-helper";
import ObjectAssign from "object-assign";

const splitAST = require("sentence-splitter").splitAST;
const SentenceSyntax = require("sentence-splitter").Syntax;

const defaultOptions = {
    interval: 2
};
const PointingPattern = /[、,]/;

// conjunction
/**
 * get first node value
 * @param node
 * @returns {string}
 */
function getFirstPhrase(node) {
    if (!PointingPattern.test(node.value)) {
        return "";
    }
    const phrases = node.value.split(PointingPattern);
    if (phrases.length > 0) {
        return phrases[0].trim();
    }
    return "";
}

module.exports = function(context, options = {}) {
    options = ObjectAssign({}, defaultOptions, options);
    const helper = new RuleHelper(context);
    const ignoreNodeManager = new IgnoreNodeManager();
    const { Syntax, getSource, report, RuleError } = context;
    let previousPhases = [];
    let useDuplicatedPhase = false;
    return {
        // reset count
        [Syntax.Header]() {
            previousPhases = [];
        },
        [Syntax.HorizontalRule]() {
            previousPhases = [];
        },
        [Syntax.Paragraph](node) {
            // FIXME: linkReference should be defined in TxtAST.
            const ignoreTypes = [
                Syntax.Code,
                Syntax.Link,
                "linkReference",
                Syntax.Image,
                Syntax.BlockQuote,
                Syntax.Emphasis
            ];
            if (helper.isChildNode(node, ignoreTypes)) {
                return;
            }
            ignoreNodeManager.ignoreChildrenByTypes(node, ignoreTypes);
            const sentences = splitAST(node).children.filter(sentence => {
                return sentence.type === SentenceSyntax.Sentence;
            });
            sentences.forEach(sentence => {
                const firstChild = sentence.children[0];
                if (!firstChild) {
                    return;
                }
                if (firstChild.type !== Syntax.Str) {
                    return;
                }
                const phrase = getFirstPhrase(firstChild);
                if (phrase.length === 0) {
                    return;
                }
                if (previousPhases.indexOf(phrase) !== -1) {
                    useDuplicatedPhase = true;
                }
                if (useDuplicatedPhase) {
                    // adjust index
                    // if  "また、[import, a.js](a.js)" then originalIndex is used.
                    // if "[import, binary-example.js](src/binary-example.js)" then  originalIndex is undefined.
                    if (!ignoreNodeManager.isIgnored(firstChild)) {
                        report(firstChild, new RuleError(`Don't repeat "${phrase}" in ${options.interval} phrases`));
                    }
                    useDuplicatedPhase = false;
                }
                // add first item
                previousPhases.unshift(phrase);
                previousPhases = previousPhases.slice(0, options.interval);
            });
        }
    };
};
