
import * as parsely from 'intel-parsely';

export const qsToInputTokens = [
  parsely.getLexer.whiteSpace,
  {
    name: 'join',
    pattern: /^&/
  },
  {
    name: 'in',
    pattern: /^__in/
  },
  {
    name: 'sep',
    pattern: /^,/
  },
  {
    name: 'contains',
    pattern: /^__contains/
  },
  {
    name: 'ends with',
    pattern: /^__endswith/
  },
  {
    name: 'value',
    pattern: /^[a-zA-Z\d]+(_[a-zA-Z\d]+)?/
  },
  {
    name: 'equals',
    pattern: /^=/
  }
];

export const inputToQsTokens = [
  parsely.getLexer.whiteSpace,
  {
    name: 'join',
    pattern: /^and/
  },
  {
    name: 'in',
    pattern: /^in/
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
    name: 'value',
    pattern: /^[a-zA-Z_\d]+/
  },
  {
    name: 'equals',
    pattern: /^=/
  },
  {
    name: 'startList',
    pattern: /^\[/
  },
  {
    name: 'endList',
    pattern: /^]/
  },
  {
    name: 'sep',
    pattern: /^,/
  }
];
