//@flow

import {describe, it, expect} from '../jasmine.js';
import {flow} from 'intel-fp';
import {qsToInputTokens} from '../../source/tokens.js';
import * as qsToInput from '../../source/qs-to-input-parser.js';
import {parseToStr} from '../../source/common-parsers.js';
import * as parsely from 'intel-parsely';

export const assign = parseToStr([
  qsToInput.value,
  qsToInput.equals,
  qsToInput.value
]);
export const like = parseToStr([
  qsToInput.value,
  qsToInput.contains,
  qsToInput.equalsEmpty,
  qsToInput.value
]);
export const ends = parseToStr([
  qsToInput.value,
  qsToInput.endsWith,
  qsToInput.equalsEmpty,
  qsToInput.value
]);
export const inList = parseToStr([
  qsToInput.value,
  qsToInput.inToken,
  qsToInput.equalsEmpty,
  qsToInput.valueSep
]);


const choices = parsely.choice([
  like,
  ends,
  inList,
  assign
]);
const expr = parsely.sepBy1(
  choices,
  qsToInput.join
);
const emptyOrExpr = parsely.optional(expr);
const statusParser = parseToStr([
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
    'a': new Error('Expected one of contains, ends with, in, equals'),
    'a= ': new Error('Expected value got end of string'),
    'a b': new Error('Expected one of contains, ends with, in, equals'),
    'a__in =': new Error('Expected value got end of string'),
    'a__in = =': new Error('Expected value got equals at character 8'),
    '__in': new Error('Expected value got in at character 0'),
    '=': new Error('Expected value got equals at character 0'),
    '&': new Error('Expected value got join at character 0'),
    'a &': new Error('Expected one of contains, ends with, in, equals'),
    'a = b &&': new Error('Expected value got join at character 7'),
    'a__in=b&&': new Error('Expected value got join at character 8'),
    'a=1&b__contains=foo': 'a = 1 and b contains foo',
    'a=1&b=2': 'a = 1 and b = 2',
    'a=b': 'a = b',
    'a__in=1,2,3': 'a in [1, 2, 3]',
    'a=b&c=d&x__in=1': 'a = b and c = d and x in [1]',
    'a__in=2&b__in=3,4,5': 'a in [2] and b in [3, 4, 5]',
    'b__in=1&a__in=2&b__in=3,4,5': 'b in [1] and a in [2] and b in [3, 4, 5]',
    'b__in=1&c=1': 'b in [1] and c = 1',
    'b__in=1&c=1&a__in=2&b__in=3,4,5&e=4&x__endswith=9':
      'b in [1] and c = 1 and a in [2] and b in [3, 4, 5] and e = 4 and x ends with 9'
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
