module.exports = {
    "plugins": [
        "stylelint-selector-bem-pattern",
        "stylelint-declaration-strict-value"
    ],
    "extends": "stylelint-config-suitcss",
    "rules": {
        "plugin/selector-bem-pattern": {
            "preset": "suit"
        },
        "indentation": 4,
        "no-missing-end-of-source-newline": null,
        "at-rule-empty-line-before": ["always", {
            "except": ["blockless-after-blockless"],
            "ignore": ["after-comment", "blockless-after-same-name-blockless"]
        }],/*
        "comment-empty-line-before": ["always", {
            "except": ["first-nested"],
            "ignore": ["stylelint-commands", "between-comments"]
        }],
        "max-line-length": null,
        "rule-non-nested-empty-line-before": ["always-multi-line", {
            ignore: ["after-comment"]
        }],*/
        "scale-unlimited/declaration-strict-value": ["font", "font-family", "font-weight", "/color/"]
    }
};