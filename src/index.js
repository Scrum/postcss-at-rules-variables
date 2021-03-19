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

module.exports = (options = {}) => {
  options = {
    atRules: [...new Set(['for', 'if', 'else', 'each', 'mixin', 'custom-media', ...options.atRules || ''])],
    variables: {...options.variables},
    declarationByWalk: options.declarationByWalk ?? false
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
        Once(root) {
          let declarativeVariables = variables;
          if (options.declarationByWalk) {
            declarativeVariables = getProperty(root);
          }

          variables = circularReference(Object.assign(declarativeVariables, options.variables));
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

module.exports.postcss = true;
