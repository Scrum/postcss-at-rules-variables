import postcss from 'postcss';
import test from 'ava';
import plugin from '../src';

const processing = (input, options) => {
  return postcss([plugin(options)]).process(input).css;
};

test('it change circular reference witch cacl', t => {
  const expected = ':root { --original-var: 4px; --nested-var: calc(2 * var(--original-var)); } .class-name { @mixin mixinName calc(2 * 4px); }';
  const value = ':root { --original-var: 4px; --nested-var: calc(2 * var(--original-var)); } .class-name { @mixin mixinName var(--nested-var); }';
  t.is(processing(value), expected);
});

test('it change circular reference', t => {
  const expected = ':root{ --from: 1; --to: var(--from)} @for $i from 1 to 1';
  const value = ':root{ --from: 1; --to: var(--from)} @for $i from var(--from) to var(--to)';
  t.is(processing(value), expected);
});

test('it should not throw error if comment exists', t => {
  const expected = ':root{ --from: 1; /* comment */ }';
  const value = ':root{ --from: 1; /* comment */ }';
  t.is(processing(value), expected);
});

test('it should not throw error if comment exists with rule', t => {
  const expected = ':root{ --from: 1; /* comment */ } @for $i from 1 to 2';
  const value = ':root{ --from: 1; /* comment */ } @for $i from var(--from) to 2';
  t.is(processing(value), expected);
});

test('it change first properties for @for', t => {
  const expected = ':root{ --from: 1; } @for $i from 1 to 2';
  const value = ':root{ --from: 1; } @for $i from var(--from) to 2';
  t.is(processing(value), expected);
});

test('it change second properties for @for', t => {
  const expected = ':root{ --to: 2; } @for $i from 1 to 2';
  const value = ':root{ --to: 2; } @for $i from 1 to var(--to)';
  t.is(processing(value), expected);
});

test('it change two properties for @for', t => {
  const expected = ':root{ --from: 1; --to: 2; } @for $i from 1 to 2';
  const value = ':root{ --from: 1; --to: 2; } @for $i from var(--from) to var(--to)';
  t.is(processing(value), expected);
});

test('it change three properties for @for', t => {
  const expected = ':root{ --from: 1; --to: 2; --step: 5 } @for $i from 1 to 2 by 5';
  const value = ':root{ --from: 1; --to: 2; --step: 5 } @for $i from var(--from) to var(--to) by var(--step)';
  t.is(processing(value), expected);
});

test('it change two properties for @if', t => {
  const expected = ':root{ --first: 1; --second: 2; } @if 1 < 2';
  const value = ':root{ --first: 1; --second: 2; } @if var(--first) < var(--second)';
  t.is(processing(value, {atRules: ['if']}), expected);
});

test('it change two properties for @if, @else if', t => {
  const expected = ':root{ --first: 1; --second: 2; } @if 1 < 2 { color: olive; } @else if 1 > 2 { color: red; }';
  const value = ':root{ --first: 1; --second: 2; } @if var(--first) < var(--second) { color: olive; } @else if var(--first) > var(--second) { color: red; }';
  t.is(processing(value, {atRules: ['if', 'else']}), expected);
});

test('it change multi properties for @each', t => {
  const expected = ':root{ --array: foo, bar, baz; } @each $val in foo, bar, baz {} @for foo, bar, baz {}';
  const value = ':root{ --array: foo, bar, baz; } @each $val in var(--array) {} @for var(--array) {}';
  t.is(processing(value, {atRules: ['each']}), expected);
});

test('it without variables', t => {
  const expected = ':root{ --red: red; } @if var(--green) { color: var(--green) }';
  const value = ':root{ --red: red; } @if var(--green) { color: var(--green) }';
  t.is(processing(value), expected);
});

test('chould change from options variables', t => {
  const expected = '@if green { .text-green { color: var(--green) }}';
  const value = '@if var(--green) { .text-green { color: var(--green) }}';
  const variables = {
    '--green': 'green'
  };
  t.is(processing(value, {variables: variables}), expected);
});

test('should change for @custom-media', t => {
  const expected = ':root{ --breakpoint-xs: 29.25em } @custom-media --viewport-xs (width > 29.25em)';
  const value = ':root{ --breakpoint-xs: 29.25em } @custom-media --viewport-xs (width > var(--breakpoint-xs))';
  t.is(processing(value, {atRules: ['custom-media']}), expected);
});
