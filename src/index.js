import postcss from 'postcss';

function hasVar(str) {
	return str.includes('var(');
}

function resolveValue(value, maps) {
	return hasVar(value) ? value.replace(/var\(--.*?\)/g, match => maps[match.slice(4, -1)] || match) : value;
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
		atRules: [...new Set(['for', 'if', 'else', 'each', 'mixin', 'custom-media', ...options.atRules || ''])],
		variables: options.variables || {}
	};

	return nodes => {
		const maps = Object.assign(getProperty(nodes), options.variables);

		nodes.walkAtRules(new RegExp(options.atRules.join('|')), rules => {
			rules.params = resolveValue(rules.params, maps);
		});
	};
});
