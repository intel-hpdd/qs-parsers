//@flow

import {describe, it, expect} from '../jasmine.js';
import {flow} from 'intel-fp';
import * as inputParser from '../../source/input-to-qs-parser.js';
import * as parsely from 'intel-parsely';
import {inputToQsTokens} from '../../source/tokens.js';

const tokenizer = parsely.getLexer(inputToQsTokens);

const assign = inputParser.assign(inputParser.value, inputParser.value);
const like = inputParser.like(inputParser.value, inputParser.value);
const ends = inputParser.ends(inputParser.value, inputParser.value);
const inList = inputParser.inList(inputParser.value, inputParser.value);
const dateParser = inputParser.dateParser(inputParser.value);

const choices = parsely.choice([
  inList,
  like,
  ends,
  assign,
  dateParser
]);
const expr = parsely.sepBy1(
  choices,
  inputParser.and
);
const emptyOrExpr = parsely.optional(
  expr
);
const statusParser = parsely.parseStr([
  emptyOrExpr,
  parsely.endOfString
]);

const statusInputToQsParser = flow(
  tokenizer,
  statusParser,
  x => x.result
);

describe('the input to qs parser', () => {
  const inputOutput = {
    '': '',
    'a': new Error('Expected one of in, contains, ends with, =, >=, <=, >, < got end of string'),
    'a = ': new Error('Expected one of value, four digit year got end of string'),
    'a b': new Error('Expected one of in, contains, ends with, =, >=, <=, >, < got b at character 2'),
    'a = [1,2,3]': new Error('Expected one of value, four digit year got [ at character 4'),
    'a in 3': new Error('Expected [ got 3 at character 5'),
    'a=b': 'a=b',
    'a in [foo,bar,baz]': 'a__in=foo,bar,baz',
    'a = info': 'a=info',
    'a = b and c = d and x in [foo]': 'a=b&c=d&x__in=foo',
    'a > 201-10-10 10:20:23': new Error('Expected four digit year got 201 at character 4'),
    'a < 2016-13-10 10:20:23': new Error('Expected two digit month between 1 and 12 got 13 at character 9'),
    'a <= 2016-12-32 10:20:23': new Error('Expected two digit day between 1 and 31 got 32 at character 13'),
    'a >= 2016-12-31 24:20:23': new Error('Expected two digit hour between 1 and 23 got 24 at character 16'),
    'a = 2016-12-31 23:60:23': new Error('Expected two digit minute between 00 and 59 got 60 at character 18'),
    'a <= 2016-12-31 23:59:60': new Error('Expected two digit second between 00 and 59 got 60 at character 22'),
    'a <= 2016-12-31 23:59:59': 'a__lte=2016-12-31 23:59:59'
  };

  Object.keys(inputOutput)
    .forEach(input => {
      var output = inputOutput[input];

      if (output instanceof Error)
        output = output.message;

      it(`should parse ${input || ' empty input '} to ${output}`, () => {
        var result = statusInputToQsParser(input);

        if (result instanceof Error)
          result = result.message;

        expect(result).toBe(output);
      });
    });
});