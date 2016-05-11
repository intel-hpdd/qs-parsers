
import * as parsely from 'intel-parsely';

export const qsToInputTokens = [
  {
    name: ' ',
    pattern: /^%20/
  },
  {
    name: '&',
    pattern: /^&/
  },
  {
    name: '__in',
    pattern: /^__in/
  },
  {
    name: ',',
    pattern: /^,/
  },
  {
    name: '__contains',
    pattern: /^__contains/
  },
  {
    name: '__endswith',
    pattern: /^__endswith/
  },
  {
    name: 'order_by',
    pattern: /^order_by/
  },
  {
    name: '__gte',
    pattern: /^__gte/
  },
  {
    name: '__gt',
    pattern: /^__gt/
  },
  {
    name: '__lte',
    pattern: /^__lte/
  },
  {
    name: '__lt',
    pattern: /^__lt/
  },
  {
    name: 'number',
    pattern: /^\d+/
  },
  {
    name: '-',
    pattern: /^\-/
  },
  {
    name: ':',
    pattern: /^:/
  },
  {
    name: 'value',
    pattern: /^[a-zA-Z\d]+(_[a-zA-Z\d]+)?/
  },
  {
    name: '=',
    pattern: /^=/
  }
];

export const inputToQsTokens = [
  parsely.getLexer.whiteSpace,
  {
    name: 'and',
    pattern: /^and/
  },
  {
    name: 'contains',
    pattern: /^contains/
  },
  {
    name: 'ends with',
    pattern: /^ends with/
  },
  {
    name: 'order by',
    pattern: /^order by/
  },
  {
    name: '>',
    pattern: /^>/
  },
  {
    name: '>=',
    pattern: /^>=/
  },
  {
    name: '<',
    pattern: /^</
  },
  {
    name: '<=',
    pattern: /^<=/
  },
  {
    name: 'number',
    pattern: /^\d+/
  },
  {
    name: '-',
    pattern: /^\-/
  },
  {
    name: ':',
    pattern: /^:/
  },
  {
    name: 'value',
    pattern: /^[a-zA-Z_\d]+/
  },
  {
    name: '=',
    pattern: /^=/
  },
  {
    name: '[',
    pattern: /^\[/
  },
  {
    name: ']',
    pattern: /^]/
  },
  {
    name: ',',
    pattern: /^,/
  }
];
