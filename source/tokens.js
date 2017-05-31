// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as parsely from '@mfl/parsely';

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
    pattern: /^%2C/
  },
  {
    name: '__contains',
    pattern: /^__contains/
  },
  {
    name: '__startswith',
    pattern: /^__startswith/
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
    name: '.',
    pattern: /^\./
  },
  {
    name: '-',
    pattern: /^\-/
  },
  {
    name: ':',
    pattern: /^%3A/
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
    name: 'starts with',
    pattern: /^starts with/
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
    name: '.',
    pattern: /^\./
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
