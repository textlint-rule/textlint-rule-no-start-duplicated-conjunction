# textlint-rule-no-start-duplicated-conjunction

[textlint](https://github.com/azu/textlint "textlint") rule that check no start with duplicated conjunction.

## Installation

    npm install textlint-rule-no-start-duplicated-conjunction

## Usage

    npm install -g textlint textlint-rule-no-start-duplicated-conjunction
    textlint --rule no-start-duplicated-conjunction README.md
    
## Config

```js
{
    "rules": {
        "no-start-duplicated-conjunction": {
            "max" : 2 // max value of continuing sentence
        }
    }
}
```

## Example

```
But, A is ~.
So, A is ~.
But, A is ~.
```

This rule report Error => "don't repeat "But" in 2 phrases"


## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
## Reference

- [[022388]文頭の接続詞の連続や、文末の表記の連続などをチェックする](http://support.justsystems.com/faq/1032/app/servlet/qadoc?QID=022388 "[022388]文頭の接続詞の連続や、文末の表記の連続などをチェックする")