import {describe, it, expect} from '../jasmine.js';
import {flow} from 'intel-fp';
import {parser} from '../../source/qs-to-old-qs-parser.js';
import {qsToInputTokens} from '../../source/tokens.js';
import * as parsely from 'intel-parsely';

const tokenizer = parsely.getLexer(qsToInputTokens);
const statusQsToOldQsParser = flow(tokenizer, parser, x => x.result);


describe('qs to old qs parser', () => {
  const inputOutput = {
    'a=1&b__contains=foo': 'a=1&b__contains=foo',
    'a=1&b=2': 'a=1&b=2',
    'a=b': 'a=b',
    'a__in=1,2,3': 'a__in=1&a__in=2&a__in=3',
    'a=b&c=d&x__in=1': 'a=b&c=d&x__in=1',
    'a__contains=bar': 'a__contains=bar',
    'order_by=foo': 'order_by=foo',
    'a=2016-05-02%2000:00:00': 'a=2016-05-02 00:00:00',
    'a__gt=2016-05-02%2000:00:00': 'a__gt=2016-05-02 00:00:00',
    'a__gte=2016-05-02%2000:00:00': 'a__gte=2016-05-02 00:00:00',
    'a__lte=2016-05-02%2000:00:00': 'a__lte=2016-05-02 00:00:00',
    'a__lt=2016-05-02%2023:59:59': 'a__lt=2016-05-02 23:59:59',
    'a__in=2&b__in=3,4,5': 'a__in=2&b__in=3&b__in=4&b__in=5',
    'b__in=1&a__in=2&b__in=3,4,5': 'b__in=1&a__in=2&b__in=3&b__in=4&b__in=5',
    'b__in=1&c=1': 'b__in=1&c=1',
    'b__in=1&c=1&a__in=2&b__in=3,4,5&e=4&x__endswith=bar':
      'b__in=1&c=1&a__in=2&b__in=3&b__in=4&b__in=5&e=4&x__endswith=bar'
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