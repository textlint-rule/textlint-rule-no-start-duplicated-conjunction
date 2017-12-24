// LICENSE : MIT
"use strict";
import rule from "../src/no-start-duplicated-conjunction";

const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
const fs = require("fs");
tester.run("no-start-duplicated-conjunction", rule, {
    valid: [
        `
しかし、〜。
だが、〜。
つまり、〜。`,
        `
[import, a.js](a.js)
[import, b.js](b.js)`,

        `[import, binary-example.js](src/binary-example.js)

8進数はファイルのパーミッションを表現するのによく利用されています。

[import, octal-example.js](src/octal-example.js)
`,
        // ignore Image
        `
[![Build Status][travis-image]][travis-url]
[![DevDependency Status][daviddm-dev-image]][daviddm-dev-url]
[![License][license-image]][license-url]
`,
        // reset count on Header
        `
しかし、〜。

# Header

しかし、〜。
`,
        // reset count on HorizontalRule
        `
しかし、〜。

----

しかし、〜。
`,
        // Real Example
        {
            text: fs.readFileSync(__dirname + "/fixtures/ok.md", "utf-8")
        },
        {
            text: fs.readFileSync(__dirname + "/fixtures/example.txt", "utf-8"),
            ext: ".txt"
        },
        {
            text: `
この **A** です。
この **B** です。     
`
        },
        {
            text: `
また、Aです。
This is Sentence. // <= 2 sentence
This is Sentence.
また、Bです。     
`,
            options: {
                interval: 2
            }
        }
    ],
    invalid: [
        // single match
        {
            text: `
But, A is A.
So, B is B.
But, Ais C.
`,
            errors: [
                {
                    message: `Don't repeat "But" in 2 phrases`,
                    line: 4,
                    column: 1
                }
            ]
        },
        {
            text: `
しかし、〜。
だが、〜。
しかし、〜。`,
            errors: [
                {
                    message: `Don't repeat "しかし" in 2 phrases`,
                    line: 4,
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
                    message: `Don't repeat "しかし" in 2 phrases`,
                    line: 3,
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
                    message: `Don't repeat "ルールは" in 2 phrases`,
                    line: 3,
                    column: 1
                }
            ]
        },

        {
            text: `また、[link](a.js)についてです。
また、[link](b.js)についです。`,
            errors: [
                {
                    message: `Don't repeat "また" in 2 phrases`,
                    line: 2,
                    column: 1
                }
            ]
        }
    ]
});
