import postcss from 'postcss';

function hasVar(string) {
  return string.includes('var(');
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

    rule.each(({type, prop: property, value}) => {
      if (type === 'decl') {
        propertys[property] = value;
      }
    });
  });

  return propertys;
}

function circularReference(maps) {
  return Object.keys(maps).reduce((previousMaps, property) => {
    previousMaps[property] = resolveValue(maps[property], maps);
    return previousMaps;
  }, maps);
}

export default postcss.plugin('postcss-at-rules-variables', (options = {}) => {
  options = {
    atRules: [...new Set(['for', 'if', 'else', 'each', 'mixin', 'custom-media', ...options.atRules || ''])],
    variables: options.variables || {}
  };

  return nodes => {
    const maps = circularReference(Object.assign(getProperty(nodes), options.variables));

    nodes.walkAtRules(new RegExp(options.atRules.join('|')), rules => {
      rules.params = resolveValue(rules.params, maps);
    });
  };
});
