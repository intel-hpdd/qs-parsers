import {describe, it, expect} from '../jasmine.js';
import {always, flow} from 'intel-fp';
import {like, ends, assign, inListOutOld, join} from '../../source/qs-to-old-qs-parser.js';
import {qsToInputTokens} from '../../source/tokens.js';
import * as parsely from 'intel-parsely';

const tokenizer = parsely.getLexer(qsToInputTokens);
const parseStr = parsely.parse(always(''));
const choices = parsely.choice([like, ends, inListOutOld, assign]);
const expr = parsely.sepBy1(choices, join);
const emptyOrExpr = parsely.optional(expr);

const qsToOldQsParser = parseStr([emptyOrExpr, parsely.endOfString]);
const statusQsToOldQsParser = flow(tokenizer, qsToOldQsParser, x => x.result);


describe('qs to old qs parser', () => {
  const inputOutput = {
    'a=1&b__contains=foo': 'a=1&b__contains=foo',
    'a=1&b=2': 'a=1&b=2',
    'a=b': 'a=b',
    'a__in=1,2,3': 'a__in=1&a__in=2&a__in=3',
    'a=b&c=d&x__in=1': 'a=b&c=d&x__in=1',
    'a__in=2&b__in=3,4,5': 'a__in=2&b__in=3&b__in=4&b__in=5',
    'b__in=1&a__in=2&b__in=3,4,5': 'b__in=1&a__in=2&b__in=3&b__in=4&b__in=5',
    'b__in=1&c=1': 'b__in=1&c=1',
    'b__in=1&c=1&a__in=2&b__in=3,4,5&e=4&x__endswith=9':
      'b__in=1&c=1&a__in=2&b__in=3&b__in=4&b__in=5&e=4&x__endswith=9'
  };

  Object.keys(inputOutput).forEach(input => {
    let output = inputOutput[input];

    if (output instanceof Error)
      output = output.message;

    it(`should parse ${(input || ' empty input ')}  to ${output}`, () => {
      let result = statusQsToOldQsParser(input);

      if (result instanceof Error)
        result = result.message;

      expect(result).toBe(output);
    });
  });
});
