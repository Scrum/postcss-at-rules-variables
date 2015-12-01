# PostCSS For Plugin
[![Build Status](https://img.shields.io/travis/GitScrum/postcss-at-rules-variables.svg?style=flat-square)](https://travis-ci.org/GitScrum/postcss-at-rules-variables)[![npm version](https://img.shields.io/npm/v/postcss-at-rules-variables.svg?style=flat-square)](https://www.npmjs.com/package/postcss-at-rules-variables)[![David](https://img.shields.io/david/GitScrum/postcss-at-rules-variables.svg?style=flat-square)](https://github.com/GitScrum/postcss-at-rules-variables)[![npm downloads](https://img.shields.io/npm/dm/postcss-at-rules-variables.svg?style=flat-square)](https://www.npmjs.com/package/postcss-at-rules-variables)[![npm](https://img.shields.io/npm/dt/postcss-at-rules-variables.svg?style=flat-square)](https://www.npmjs.com/package/postcss-at-rules-variables)[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=flat-square)](https://github.com/sindresorhus/xo)[![Coveralls Status](http://img.shields.io/coveralls/gitscrum/postcss-at-rules-variables.svg?style=flat-square)](https://coveralls.io/r/gitscrum/postcss-at-rules-variables)

Used in conjunction with the plugin [postcss-each], [postcss-conditionals], [postcss-for] and more at-rules plugins.


```css
/* input.css */
:root {
	--array: foo, bar, baz;
	--from: 1;
	--to: 3;
	--icon-exclude: 2;
	--color-danger: red;
}

@each $val in var(--array) {
	@import "$val.css";
}
```

```css
/* foo.css */
html {
	background-color: var(--color-danger);
}
```

```css
/* bar.css */
.some-class {
	color: #fff;

	@for $val from var(--from) to var(--to) {
		@if $val != var(--icon-exclude) {
			.icon-$val {
				background-position: 0 $(val)px;
			}
		}
	}
}
```

```css
/* baz.css */
h1 {
	font-size: 24px;
}

@import "biz.css";
```

```css
/* biz.css */
h2 {
	color: olive;
}
```

```css
/* Output example */
html {
	background-color: red;
}
.some-class {
	color: #fff;
	.icon-1 {
		background-position: 0 1px;
	}
	.icon-3 {
		background-position: 0 3px;
	}
}
h1 {
	font-size: 24px;
}
h2 {
	color: olive;
}

```

## Installation

```console
$ npm install postcss-at-rules-variables
```

## Usage
Use postcss-at-rules-variables before you at-rules plugin

```js
// dependencies
var fs = require("fs");
var postcss = require("postcss");
var atImport = require("postcss-import");
var atEach = require("postcss-each");
var atVariables = require("postcss-at-rules-variables");
var atIf = require('postcss-conditionals');
var atFor = require('postcss-for');
var customProperties = require("postcss-custom-properties");


// css to be processed
var css = fs.readFileSync("css/input.css", "utf8");

// process css
var output = postcss()
  .use(atVariables({ /* options */ }))
  .use(atEach())
  .use(atImport({
  	plugins: [
  		require("postcss-at-rules-variables")({ /* options */ }),
  		require("postcss-import"),
  	]
  }))
  .use(atFor())
  .use(atIf())
  .use(customProperties())
  .process(css, {
    from: "css/input.css"
  })
  .css;

console.log(output);
```

### Options

#### `atRules`

Type: `Array`  
Default: `['for', 'if', 'else', 'each']`

See [PostCSS](https://github.com/postcss/postcss) docs for examples for your environment.

[postcss-conditionals]:		https://github.com/andyjansson/postcss-conditionals
[postcss-each]:				https://github.com/outpunk/postcss-each
[postcss-for]:				https://github.com/antyakushev/postcss-for
