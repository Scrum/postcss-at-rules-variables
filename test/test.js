/* global describe it */
import postcss from 'postcss';
import {expect} from 'chai';
import plugin from '../lib/index';
const test = (input, output, opts) => {
	expect(postcss([plugin(opts)]).process(input).css).to.eql(output);
};

describe('postcss-at-rules-variables', () => {
	it('it change first properties for @for', () => {
		test(
			':root{ --from: 1; } @for $i from var(--from) to 2',
			':root{ --from: 1; } @for $i from 1 to 2'
		);
	});

	it('it change second properties for @for', () => {
		test(
			':root{ --to: 2; } @for $i from 1 to var(--to)',
			':root{ --to: 2; } @for $i from 1 to 2'
		);
	});

	it('it change two properties for @for', () => {
		test(
			':root{ --from: 1; --to: 2; } @for $i from var(--from) to var(--to)',
			':root{ --from: 1; --to: 2; } @for $i from 1 to 2'
		);
	});

	it('it change three properties for @for', () => {
		test(
			':root{ --from: 1; --to: 2; --step: 5 } @for $i from var(--from) to var(--to) by var(--step)',
			':root{ --from: 1; --to: 2; --step: 5 } @for $i from 1 to 2 by 5'
		);
	});

	it('it change two properties for @if', () => {
		test(
			':root{ --first: 1; --second: 2; } @if var(--first) < var(--second)',
			':root{ --first: 1; --second: 2; } @if 1 < 2',
			{atRules: ['if']}
		);
	});

	it('it change two properties for @if, @else if', () => {
		test(
			':root{ --first: 1; --second: 2; } @if var(--first) < var(--second) { color: olive; } @else if var(--first) > var(--second) { color: red; }',
			':root{ --first: 1; --second: 2; } @if 1 < 2 { color: olive; } @else if 1 > 2 { color: red; }',
			{atRules: ['if', 'else']}
		);
	});

	it('it change multi properties for @each', () => {
		test(
			':root{ --array: foo, bar, baz; } @each $val in var(--array)',
			':root{ --array: foo, bar, baz; } @each $val in foo, bar, baz',
			{atRules: ['each']}
		);
	});
});
