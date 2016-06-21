//@flow

import {describe, it, expect} from '../jasmine.js';
import {flow} from 'intel-fp';
import {qsToInputTokens} from '../../source/tokens.js';
import * as qsToInput from '../../source/qs-to-input-parser.js';
import * as parsely from 'intel-parsely';

export const assign = qsToInput.assign(qsToInput.value, qsToInput.value);
export const like = qsToInput.like(qsToInput.value, qsToInput.value);
export const starts = qsToInput.starts(qsToInput.value, qsToInput.value);
export const ends = qsToInput.ends(qsToInput.value, qsToInput.value);
export const inList = qsToInput.inList(qsToInput.value, qsToInput.value);

const choices = parsely.choice([
  like,
  starts,
  ends,
  inList,
  assign
]);
const expr = parsely.sepBy1(
  choices,
  qsToInput.and
);
const emptyOrExpr = parsely.optional(expr);
const statusParser = parsely.parseStr([
  emptyOrExpr,
  parsely.endOfString
]);
const tokenizer = parsely.getLexer(qsToInputTokens);
const statusQsToInputParser = flow(
  tokenizer,
  statusParser,
  x => x.result
);

describe('qs to input parser test', () => {
  const inputOutput = {
    '': '',
    'a': new Error('Expected one of __contains, __startswith, __endswith, __in, = got end of string'),
    'a=': new Error('Expected value got end of string'),
    'a__in=': new Error('Expected value got end of string'),
    'a__in==': new Error('Expected value got = at character 6'),
    '__in': new Error('Expected value got __in at character 0'),
    '=': new Error('Expected value got = at character 0'),
    '&': new Error('Expected value got & at character 0'),
    'a&': new Error('Expected one of __contains, __startswith, __endswith, __in, = got & at character 1'),
    'a=b&&': new Error('Expected value got & at character 4'),
    'a__in=b&&': new Error('Expected value got & at character 8'),
    'a=bar&b__contains=foo': 'a = bar and b contains foo',
    'a=foo&b=bar': 'a = foo and b = bar',
    'a=b': 'a = b',
    'a__startswith=foobar': 'a starts with foobar',
    'a__endswith=foobar': 'a ends with foobar',
    'a__contains=foobar': 'a contains foobar',
    'a__in=foo,bar,baz': 'a in [foo, bar, baz]',
    'a=b&c=d&x__in=bar': 'a = b and c = d and x in [bar]',
    'a__in=b&b__in=c,d,e': 'a in [b] and b in [c, d, e]',
    'b__in=c&a__in=d&b__in=f,g,h': 'b in [c] and a in [d] and b in [f, g, h]',
    'b__in=c&c=d': 'b in [c] and c = d',
    'b__in=d&c=e&a__in=g&b__in=f,g,h&e=t&x__endswith=bar':
      'b in [d] and c = e and a in [g] and b in [f, g, h] and e = t and x ends with bar'
  };

  Object.keys(inputOutput).forEach(input => {
    var output = inputOutput[input];

    if (output instanceof Error)
      output = output.message;

    it('should parse ' + (input || ' empty input ') + ' to ' + output, function () {
      var result = statusQsToInputParser(input);

      if (result instanceof Error)
        result = result.message;

      expect(result).toBe(output);
    });
  });
});
