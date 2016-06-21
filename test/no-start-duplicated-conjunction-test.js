// LICENSE : MIT
"use strict";
import rule from "../src/no-start-duplicated-conjunction"
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
tester.run("no-start-duplicated-conjunction", rule, {
    valid: [
        `
しかし、〜。
だが、〜。
つまり、〜。`,

    ],
    invalid: [
        // single match
        {
            text: `
しかし、〜。
だが、〜。
しかし、〜。`,
            errors: [
                {
                    message: `don't repeat "しかし" in 2 phrases`,
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            text: `
しかし、〜。
しかし、〜。`,
            errors: [
                {
                    message: `don't repeat "しかし" in 2 phrases`,
                    line: 2,
                    column: 1
                }
            ]
        },
        {
            text: `
- ルールは、contextを受け取る以外は本体の実装の詳細を知らなくて良い
- ルールは、設定値などがJavaScriptで表現でき、npmで共有できる作りになっている`,
            errors: [
                {
                    message: `don't repeat "ルールは" in 2 phrases`,
                    line: 3,
                    column: 3
                }
            ]
        }
    ]
});
