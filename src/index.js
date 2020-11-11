function hasVar(string) {
  return string.includes('var(');
}

function resolveValue(value, maps) {
  return hasVar(value) ? value.replace(/var\(--.*?\)/g, match => maps[match.slice(4, -1)] || match) : value;
}

function circularReference(maps) {
  return Object.keys(maps).reduce((previousMaps, property) => {
    previousMaps[property] = resolveValue(maps[property], maps);
    return previousMaps;
  }, maps);
}

export default (options = {}) => {
  options = {
    atRules: [...new Set(['for', 'if', 'else', 'each', 'mixin', 'custom-media', ...options.atRules || ''])],
    variables: {...options.variables},
  };

  return {
    postcssPlugin: 'postcss-at-rules-variables',
    prepare() {
      let variables = {};
      return {
        Declaration(node) {
          if (node.variable) {
            variables[node.prop] = node.value;
          }
        },
        Once() {
          variables = circularReference(Object.assign(variables, options.variables));
        },
        AtRule(rule) {
          if (options.atRules.includes(rule.name)) {
            rule.params = resolveValue(rule.params, variables);
          }
        }
      };
    }
  };
};

export const postcss = true;
