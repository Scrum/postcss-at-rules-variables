import postcss from 'postcss';

function hasVar(str) {
	return str.indexOf('var(');
}

function resolveValue(value, maps) {
	if (hasVar(value) === -1) {
		return value;
	}

	return value.replace(/var\(--.*?\)/g, match => maps[match.slice(4, -1)] || match);
}

function getProperty(nodes) {
	let propertys = {};

	nodes.walkRules(rule => {
		if (rule.selector !== ':root') {
			return;
		}

		rule.each(({prop, value}) => {
			propertys[prop] = value;
		});
	});

	return propertys;
}

export default postcss.plugin('postcss-at-rules-variables', (options = {}) => {
	options = {
		atRules: [...new Set(['for', 'if', 'else', 'each', 'mixin', 'custom-media', ...options.atRules || ''])]
	};

	return nodes => {
		const maps = getProperty(nodes);

		nodes.walkAtRules(new RegExp(options.atRules.join('|')), rules => {
			rules.params = resolveValue(rules.params, maps);
		});
	};
});
