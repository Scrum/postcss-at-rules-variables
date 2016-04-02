import postcss from 'postcss';
import deepAssign from 'deep-assign';

const VAR_FUNC_IDENTIFIER = 'var';
const maps = {};

function resolveValue(value) {
	const hasVar = value.indexOf(`${VAR_FUNC_IDENTIFIER}(`);
	if (hasVar === -1) {
		return value;
	}

	return value.replace(/var\(--.*?\)/g, (match) => maps[match.slice(4, -1)] || match);
}

export default postcss.plugin('postcss-at-rules-variables', options => {
	const DEFAULT = {
		atRules: ['for', 'if', 'else', 'each']
	};

	const mergeOptions = deepAssign(DEFAULT, options, (a, b) => {
		if (Array.isArray(a)) {
			return a.concat(b);
		}
	});

	return nodes => {
		const reg = new RegExp(mergeOptions.atRules.join('|'));

		nodes.walkRules(rule => {
			if (rule.selector !== ':root') {
				return;
			}

			rule.each(decl => {
				const prop = decl.prop;
				const value = decl.value;
				maps[prop] = value;
			});
		});

		nodes.walkAtRules(reg, rules => {
			rules.params = resolveValue(rules.params);
		});
	};
});
