# postcss-at-rules-variables plugin for <img valign="middle" height="49" title="PostCSS" src="http://postcss.github.io/postcss/logo.svg">
> [PostCSS](https://github.com/postcss/postcss) plugin to transform [W3C CSS Custom Properties](http://www.w3.org/TR/css-variables/) for at-rule’s parameters.

[![Travis Build Status](https://img.shields.io/travis/GitScrum/postcss-at-rules-variables.svg?style=flat-square&label=unix)](https://travis-ci.org/GitScrum/postcss-at-rules-variables)[![AppVeyor Build Status](https://img.shields.io/appveyor/ci/GitScrum/postcss-at-rules-variables.svg?style=flat-square&label=windows)](https://ci.appveyor.com/project/GitScrum/postcss-at-rules-variables)[![testen badge](https://img.shields.io/badge/testen-passing-brightgreen.svg?style=flat-square)][testen repo][![node](https://img.shields.io/node/v/postcss-at-rules-variables.svg?maxAge=2592000&style=flat-square)]()[![npm version](https://img.shields.io/npm/v/postcss-at-rules-variables.svg?style=flat-square)](https://www.npmjs.com/package/postcss-at-rules-variables)[![Dependency Status](https://david-dm.org/gitscrum/postcss-at-rules-variables.svg?style=flat-square)](https://david-dm.org/gitscrum/postcss-at-rules-variables)[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=flat-square)](https://github.com/sindresorhus/xo)[![Coveralls status](https://img.shields.io/coveralls/GitScrum/postcss-at-rules-variables.svg?style=flat-square)](https://coveralls.io/r/GitScrum/postcss-at-rules-variables)

[![npm downloads](https://img.shields.io/npm/dm/postcss-at-rules-variables.svg?style=flat-square)](https://www.npmjs.com/package/postcss-at-rules-variables)[![npm](https://img.shields.io/npm/dt/postcss-at-rules-variables.svg?style=flat-square)](https://www.npmjs.com/package/postcss-at-rules-variables)[![Package Quality](http://npm.packagequality.com/shield/postcss-at-rules-variables.svg?style=flat-square)](http://packagequality.com/#?package=postcss-at-rules-variables)[![BADGINATOR](https://badginator.herokuapp.com/gitscrum/postcss-at-rules-variables.svg?style=flat-square)](https://github.com/gitscrum/postcss-at-rules-variables)


## Why?
Adds the ability to use a custom property in the options, at-rules. 
*Used in conjunction with the plugin [postcss-each], [postcss-conditionals], [postcss-for] and more at-rules plugins.*  

## Install

```bash
$ npm install postcss-at-rules-variables
```

> **Note:** This project is compatible with node v4+

## Usage

```js
// dependencies
var fs = require('fs');
var postcss = require('postcss');
var atImport = require('postcss-import');
var atEach = require('postcss-each');
var atVariables = require('postcss-at-rules-variables');
var atIf = require('postcss-conditionals');
var atFor = require('postcss-for');
var customProperties = require('postcss-custom-properties');
var nested = require('postcss-nested');

// css to be processed
var css = fs.readFileSync('css/input.css', 'utf8');

// process css
var output = postcss()
    .use(atVariables({ /* atRules: ['media'] */ }))
    .use(atEach())
    .use(atImport({
        plugins: [
            require('postcss-at-rules-variables')({ /* options */ }),
            require('postcss-import')
        ]
    }))
    .use(atFor())
    .use(atIf())
    .use(customProperties())
    .use(nested())
    .process(css, {
        from: 'css/input.css'
    })
    .css;

console.log(output);
```
*Use postcss-at-rules-variables before you at-rules plugin*

# Example

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
}

.some-class .icon-1 {
    background-position: 0 1px;
}

.some-class .icon-3 {
    background-position: 0 3px;
}

h1 {
    font-size: 24px;
}

h2 {
    color: olive;
}

```

## Options

#### `atRules`

Type: `Array`  
Default: `['for', 'if', 'else', 'each']`  
Description: *The array used in all at-rules in your project*

## LICENSE

> MIT License (MIT)

>Copyright (c) Ivan Demidov <scrum@list.ru>

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,

[postcss-conditionals]:     https://github.com/andyjansson/postcss-conditionals
[postcss-each]:             https://github.com/outpunk/postcss-each
[postcss-for]:              https://github.com/antyakushev/postcss-for
[testen repo]:              https://github.com/egoist/testen
