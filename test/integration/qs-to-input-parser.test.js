//@flow

import * as fp from '@iml/fp';
import * as qsToInput from '../../source/qs-to-input-parser.js';
import * as parsely from '@iml/parsely';

import { describe, it, expect } from '../jasmine.js';

import { qsToInputTokens } from '../../source/tokens.js';

export const assign = qsToInput.assign(qsToInput.value, qsToInput.value);
export const like = qsToInput.like(qsToInput.value, qsToInput.value);
export const starts = qsToInput.starts(qsToInput.value, qsToInput.value);
export const ends = qsToInput.ends(qsToInput.value, qsToInput.value);
export const inList = qsToInput.inList(qsToInput.value, qsToInput.value);
export const dateParser = qsToInput.dateParser(qsToInput.value);

const hostnames = parsely.many1(parsely.choice([qsToInput.dot, qsToInput.dash, qsToInput.value, qsToInput.number]));
const assignHostname = qsToInput.assign(parsely.matchValue('hostname'), hostnames);

const choices = parsely.choice([like, starts, ends, inList, assignHostname, assign, dateParser]);
const expr = parsely.sepBy1(choices)(qsToInput.and);
const emptyOrExpr = parsely.optional(expr);
const statusParser = parsely.parseStr([emptyOrExpr, parsely.endOfString]);
const tokenizer = parsely.getLexer(qsToInputTokens);
const statusQsToInputParser = fp.flow(
  tokenizer,
  statusParser,
  x => x.result
);

describe('qs to input parser test', () => {
  const inputOutput = {
    '': '',
    a: new Error(
      'Expected one of __contains, __startswith, __endswith, __in, =, ' + '__gte, __lte, __gt, __lt got end of string'
    ),
    'a=': new Error('Expected one of value, four digit year got end of string'),
    'a__in=': new Error('Expected value got end of string'),
    'a__in==': new Error('Expected value got = at character 6'),
    __in: new Error('Expected one of value, hostname got __in at character 0'),
    '=': new Error('Expected one of value, hostname got = at character 0'),
    '&': new Error('Expected one of value, hostname got & at character 0'),
    'a&': new Error(
      'Expected one of __contains, __startswith, __endswith, __in, =, ' +
        '__gte, __lte, __gt, __lt got & at character 1'
    ),
    'a=b&&': new Error('Expected one of value, hostname got & at character 4'),
    'a__in=b&&': new Error('Expected one of value, hostname got & at character 8'),
    'a__gte=2016-08-30%2019%3A44%3A31': new Error('Expected one of utc, UTC, z, Z got end of string'),
    'a=bar&b__contains=foo': 'a = bar and b contains foo',
    'a=foo&b=bar': 'a = foo and b = bar',
    'a=b': 'a = b',
    'a__startswith=foobar': 'a starts with foobar',
    'a__endswith=foobar': 'a ends with foobar',
    'a__contains=foobar': 'a contains foobar',
    'a__in=foo%2Cbar%2Cbaz': 'a in [foo, bar, baz]',
    'a=b&c=d&x__in=bar': 'a = b and c = d and x in [bar]',
    'a__in=b&b__in=c%2Cd%2Ce': 'a in [b] and b in [c, d, e]',
    'b__in=c&a__in=d&b__in=f%2Cg%2Ch': 'b in [c] and a in [d] and b in [f, g, h]',
    'b__in=c&c=d': 'b in [c] and c = d',
    'a__gte=2016-08-30%2019%3A44%3A31UTC': 'a >= 2016-08-30 19:44:31UTC',
    'a__gte=2016-08-30%2019%3A44%3A31utc': 'a >= 2016-08-30 19:44:31utc',
    'a__gte=2016-08-30%2019%3A44%3A31Z': 'a >= 2016-08-30 19:44:31Z',
    'a__gte=2016-08-30%2019%3A44%3A31z': 'a >= 2016-08-30 19:44:31z',
    'b__in=d&c=e&a__in=g&b__in=f%2Cg%2Ch&e=t&x__endswith=bar':
      'b in [d] and c = e and a in [g] and b in [f, g, h] and e = t and x ends with bar',
    'hostname=lotus-35vm13.lotus.hpdd.lab.intel.com': 'hostname = lotus-35vm13.lotus.hpdd.lab.intel.com'
  };

  Object.keys(inputOutput).forEach(input => {
    let output = inputOutput[input];

    if (output instanceof Error) output = output.message;

    it('should parse ' + (input || ' empty input ') + ' to ' + output, function() {
      let result = statusQsToInputParser(input);

      if (result instanceof Error) result = result.message;

      expect(result).toBe(output);
    });
  });
});
