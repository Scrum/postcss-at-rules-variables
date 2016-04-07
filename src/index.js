import postcss from 'postcss';
import {mergeWith} from 'lodash';

function hasVar(str) {
	return str.indexOf('var(');
}

function resolveValue(value, maps) {
	if (hasVar(value) === -1) {
		return value;
	}

	return value.replace(/var\(--.*?\)/g, (match) => maps[match.slice(4, -1)] || match);
}

function getProperty(nodes) {
	let propertys = {};

	nodes.walkRules(rule => {
		if (rule.selector !== ':root') {
			return;
		}

		rule.each(decl => {
			const {prop, value} = decl;
			propertys[prop] = value;
		});
	});

	return propertys;
}

export default postcss.plugin('postcss-at-rules-variables', options => {
	const DEFAULT = {
		atRules: ['for', 'if', 'else', 'each']
	};

	const opt = mergeWith(DEFAULT, options, (a, b) => {
		if (Array.isArray(a)) {
			return a.concat(b);
		}
	});

	return nodes => {
		const maps = getProperty(nodes);
		const {atRules} = opt;

		nodes.walkAtRules(new RegExp(atRules.join('|')), rules => {
			rules.params = resolveValue(rules.params, maps);
		});
	};
});
