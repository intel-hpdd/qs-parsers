// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';
import * as parsely from '@mfl/parsely';

import type { tokensToResult } from '@mfl/parsely';

import { YYYY, MM, DD, hh, mm, ss, dash, colon } from './input-to-qs-parser.js';

export { value, number, dot, dash } from './input-to-qs-parser.js';

export const sep: tokensToResult = parsely.tokenTo(',', ', ');
export const valueSep = (v: tokensToResult): tokensToResult =>
  fp.flow(parsely.sepBy1(v)(sep), parsely.onSuccess(x => `[${x}]`));

export const and: tokensToResult = parsely.tokenTo('&', ' and ');

export const contains: tokensToResult = parsely.tokenTo(
  '__contains',
  ' contains '
);
export const startsWith: tokensToResult = parsely.tokenTo(
  '__startswith',
  ' starts with '
);
export const endsWith: tokensToResult = parsely.tokenTo(
  '__endswith',
  ' ends with '
);
export const equals: tokensToResult = parsely.tokenTo('=', ' = ');
export const equalsEmpty: tokensToResult = parsely.tokenTo('=', '');
export const inToken: tokensToResult = parsely.parseStr([
  parsely.tokenTo('__in', ' in '),
  equalsEmpty
]);
export const orderBy: tokensToResult = parsely.parseStr([
  parsely.tokenTo('order_by', ' order by '),
  equalsEmpty
]);

export const gte: tokensToResult = parsely.parseStr([
  parsely.tokenTo('__gte', ' >= '),
  equalsEmpty
]);
export const lte: tokensToResult = parsely.parseStr([
  parsely.tokenTo('__lte', ' <= '),
  equalsEmpty
]);
export const lt: tokensToResult = parsely.parseStr([
  parsely.tokenTo('__lt', ' < '),
  equalsEmpty
]);
export const gt: tokensToResult = parsely.parseStr([
  parsely.tokenTo('__gt', ' > '),
  equalsEmpty
]);

export const assign = (l: tokensToResult, r: tokensToResult) =>
  parsely.parseStr([l, equals, r]);

export const like = (l: tokensToResult, r: tokensToResult) =>
  parsely.parseStr([l, contains, equalsEmpty, r]);

export const starts = (l: tokensToResult, r: tokensToResult) =>
  parsely.parseStr([l, startsWith, equalsEmpty, r]);

export const ends = (l: tokensToResult, r: tokensToResult) =>
  parsely.parseStr([l, endsWith, equalsEmpty, r]);

export const inList = (l: tokensToResult, r: tokensToResult) =>
  parsely.parseStr([l, inToken, valueSep(r)]);

export const space: tokensToResult = parsely.tokenTo(' ', ' ');

export const date = parsely.parseStr([
  YYYY,
  dash,
  MM,
  dash,
  DD,
  space,
  hh,
  colon,
  mm,
  colon,
  ss
]);

export const dateParser = (v: tokensToResult) =>
  parsely.parseStr([v, parsely.choice([gte, lte, gt, lt, equals]), date]);

export const orderByParser = (v: tokensToResult) =>
  fp.flow(
    parsely.parseStr([
      orderBy,
      parsely.choice([
        fp.flow(
          parsely.parseStr([parsely.tokenTo('-', ''), v]),
          parsely.onSuccess((x: string) => x + ' desc ')
        ),
        fp.flow(v, parsely.onSuccess(x => x + ' asc '))
      ])
    ])
  );
