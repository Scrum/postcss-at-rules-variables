import postcss from 'postcss';
import balanced from 'balanced-match';
import _ from 'lodash';

const VAR_FUNC_IDENTIFIER = 'var';
const maps = {};

function resolveValue(value) {
	const start = value.indexOf(`${VAR_FUNC_IDENTIFIER}(`);
	if (start === -1) {
		return value;
	}

	value.match(/var\(\S*\)/g).map(match => {
		const matches = balanced('(', ')', match);
		const reg = new RegExp(`${VAR_FUNC_IDENTIFIER}.(${matches.body}.)`, 'g');
		const property = maps[matches.body] || match;

		value = value.replace(reg, property);
		return true;
	});
	return value;
}

module.exports = postcss.plugin('postcss-at-rules-variables', options => {
	const DEFAULT = {
		atRules: ['for', 'if', 'else', 'each']
	};

	const mergeOoptions = _.merge(DEFAULT, options, (a, b) => {
		if (_.isArray(a)) {
			return a.concat(b);
		}
	});

	return css => {
		const reg = new RegExp(mergeOoptions.atRules.join('|'));

		css.walkRules(rule => {
			if (rule.selectors[0] !== ':root') {
				return;
			}

			rule.each(decl => {
				const prop = decl.prop;
				const value = decl.value;
				maps[prop] = value;
			});
		});

		css.walkAtRules(reg, rules => {
			rules.params = resolveValue(rules.params);
		});
	};
});
