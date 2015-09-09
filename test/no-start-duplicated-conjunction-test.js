// LICENSE : MIT
"use strict";
import assert from "power-assert"
import {textlint} from "textlint"
import rule from "../src/no-start-duplicated-conjunction"
describe("no-start-duplicated-conjunction", function () {
    beforeEach(function () {
        textlint.setupRules({
            "no-start-duplicated-conjunction": rule
        });
    });
    afterEach(function () {
        textlint.resetRules();
    });
    context("when use duplicated conjunction at distance sentence <=2", function () {
        it("should report error", function () {
            var results = textlint.lintMarkdown(`
しかし、〜。
だが、〜。
しかし、〜。`);
            assert(results.messages.length > 0);
        });
    });
    context("when use same conjunction in series", function () {
        it("should report error", function () {
            var results = textlint.lintMarkdown(`
しかし、〜。
しかし、〜。`);
            assert(results.messages.length > 0);
        });
    });
    context("when not use same conjunction in series", function () {
        it("should report error", function () {
            var results = textlint.lintMarkdown(`
しかし、〜。
だが、〜。
つまり、〜。`);
            assert(results.messages.length === 0);
        });
    });
    context("when load from file", function () {
        it("should report error", function () {
            var results = textlint.lintFile(__dirname +"/fixtures/README.md");
            console.log(results.messages);
            assert(results.messages.length === 0);
        });
    });
});
