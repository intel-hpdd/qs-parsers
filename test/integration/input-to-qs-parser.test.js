//@flow

import { describe, it, expect } from '../jasmine.js';
import * as fp from '@iml/fp';
import * as inputParser from '../../source/input-to-qs-parser.js';
import * as parsely from '@iml/parsely';
import { inputToQsTokens } from '../../source/tokens.js';

const tokenizer = parsely.getLexer(inputToQsTokens);

const assign = inputParser.assign(inputParser.value, inputParser.value);
const like = inputParser.like(inputParser.value, inputParser.value);
const starts = inputParser.starts(inputParser.value, inputParser.value);
const ends = inputParser.ends(inputParser.value, inputParser.value);
const inList = inputParser.inList(inputParser.value, inputParser.value);
const dateParser = inputParser.dateParser(inputParser.value);

const hostnames = parsely.many1(
  parsely.choice([inputParser.dot, inputParser.dash, inputParser.value, inputParser.number])
);

const assignHostname = inputParser.assign(parsely.matchValue('hostname'), hostnames);

const choices = parsely.choice([inList, like, starts, ends, assignHostname, assign, dateParser]);
const expr = parsely.sepBy1(choices)(inputParser.and);
const emptyOrExpr = parsely.optional(expr);
const statusParser = parsely.parseStr([emptyOrExpr, parsely.endOfString]);

const statusInputToQsParser = fp.flow(
  tokenizer,
  statusParser,
  x => x.result
);

describe('the input to qs parser', () => {
  const inputOutput = {
    '': '',
    a: new Error('Expected one of in, contains, starts with, ends with, =, >=, <=, >, < got end of string'),
    'a = ': new Error('Expected one of value, four digit year got end of string'),
    'a b': new Error('Expected one of in, contains, starts with, ends with, =, >=, <=, >, < got b at character 2'),
    'a = [1,2,3]': new Error('Expected one of value, four digit year got [ at character 4'),
    'a in 3': new Error('Expected [ got 3 at character 5'),
    'a=b': 'a=b',
    'a in [foo,bar,baz]': 'a__in=foo,bar,baz',
    'a starts with foobar': 'a__startswith=foobar',
    'a ends with foobar': 'a__endswith=foobar',
    'a contains foobar': 'a__contains=foobar',
    'a = info': 'a=info',
    'a = b and c = d and x in [foo]': 'a=b&c=d&x__in=foo',
    'a > 201-10-10 10:20:23': new Error('Expected four digit year got 201 at character 4'),
    'a < 2016-13-10 10:20:23': new Error('Expected two digit month between 1 and 12 got 13 at character 9'),
    'a <= 2016-12-32 10:20:23': new Error('Expected two digit day between 1 and 31 got 32 at character 13'),
    'a >= 2016-12-31 24:20:23': new Error('Expected two digit hour between 1 and 23 got 24 at character 16'),
    'a = 2016-12-31 23:60:23': new Error('Expected two digit minute between 00 and 59 got 60 at character 18'),
    'a <= 2016-12-31 23:59:60': new Error('Expected two digit second between 00 and 59 got 60 at character 22'),
    'a <= 2018-06-28 08:11:32B': new Error('Expected one of utc, UTC got B at character 24'),
    'a <= 2018-06-28 08:11:32UTC': 'a__lte=2018-06-28 08:11:32UTC',
    'a <= 2018-06-28 08:11:32utc': 'a__lte=2018-06-28 08:11:32UTC',
    'a <= 2018-06-28 08:11:32UTC and c=d': 'a__lte=2018-06-28 08:11:32UTC&c=d',
    'hostname = lotus-35vm13.lotus.hpdd.lab.intel.com': 'hostname=lotus-35vm13.lotus.hpdd.lab.intel.com'
  };

  Object.keys(inputOutput).forEach(input => {
    let output = inputOutput[input];

    if (output instanceof Error) output = output.message;

    it(`should parse ${input || ' empty input '} to ${output}`, () => {
      let result = statusInputToQsParser(input);

      if (result instanceof Error) result = result.message;

      expect(result).toBe(output);
    });
  });
});
