var postcss = require('postcss');
var balanced = require('balanced-match');
var objectAssign = require('object-assign');

var VAR_FUNC_IDENTIFIER = 'var',
    maps = {};

function resolveValue(value) {

    var start = value.indexOf(VAR_FUNC_IDENTIFIER + '(');

    if (start === -1) {
        return [value];
    }

    value.match(/var\(\S*\)/g).map(function(match){



        var matches = balanced('(', ')', match);
        var reg = new RegExp(VAR_FUNC_IDENTIFIER + '.\(' + matches.body + '.\)', 'g');
        var property = maps[matches.body];

        value = value.replace(reg, property);

    });

    return value;

}

module.exports = postcss.plugin('postcss-at-rules-variables', function(options) {

    var DEFAULT = ({
        options: {
            atRules: ['for', 'if', 'else', 'each']
        },
        _concatRules: function(atRules){
            this.options.atRules = this.options.atRules.concat(atRules);
            return this.options;
        }
    }._concatRules(options && options.atRules || []));

    options = objectAssign({}, options, DEFAULT);


    return function (css) {

        var reg = new RegExp(options.atRules.join('|'));

        css.walkRules(function(rule){
            if (rule.selectors[0] !== ':root') {
                return;
            }

            rule.each(function(decl){
                var prop = decl.prop,
                    value = decl.value;
                maps[prop] = value;
            });
        });

        css.walkAtRules(reg, function(rules){
            rules.params = resolveValue(rules.params);
        });

    };
});
