// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';
import * as parsely from '@mfl/parsely';

import type { tokensToResult } from '@mfl/parsely';

const token = parsely.token(fp.always(true));
const successTxt = txt => parsely.onSuccess(fp.always(txt));

export const value: tokensToResult = token('value');
export const number: tokensToResult = token('number');

export const inToken: tokensToResult = parsely.matchValueTo('in', '__in=');

export const equals = parsely.tokenTo('=', '=');

export const contains = parsely.tokenTo('contains', '__contains=');

export const startsWith = parsely.tokenTo('starts with', '__startswith=');

export const endsWith = parsely.tokenTo('ends with', '__endswith=');

export const and = parsely.tokenTo('and', '&');

export const startList = parsely.tokenTo('[', '');

export const endList = parsely.tokenTo(']', '');

export const sep = parsely.tokenTo(',', ',');

export const dot = parsely.tokenTo('.', '.');

export const gt = parsely.tokenTo('>', '__gt=');

export const gte: tokensToResult = fp.flow(
  parsely.parseStr([gt, equals]),
  successTxt('__gte='),
  parsely.onError(e => e.adjust(['>=']))
);

export const lt = parsely.tokenTo('<', '__lt=');

export const lte: tokensToResult = fp.flow(
  parsely.parseStr([lt, equals]),
  successTxt('__lte='),
  parsely.onError(e => e.adjust(['<=']))
);

export const dash = parsely.tokenTo('-', '-');

export const colon = parsely.tokenTo(':', ':');

export const orderBy = parsely.tokenTo('order by', 'order_by=');

export const desc: tokensToResult = parsely.matchValueTo('desc', '-');

export const asc: tokensToResult = parsely.matchValueTo('asc', '');

export const ascOrDesc: tokensToResult = parsely.choice([asc, desc]);

const datePart = (cond: Function, expected: string): tokensToResult =>
  fp.flow(
    parsely.token(cond)('number'),
    parsely.onError(e => e.adjust([expected]))
  );

const parseNum = n => parseInt(n, 10);

export const YYYY = datePart(x => x.length === 4, 'four digit year');

export const MM = datePart(
  x => x.length == 2 && parseNum(x) > 0 && parseNum(x) < 13,
  'two digit month between 1 and 12'
);

export const DD = datePart(
  x => x.length == 2 && parseNum(x) > 0 && parseNum(x) < 32,
  'two digit day between 1 and 31'
);

export const hh = datePart(
  x => x.length == 2 && parseNum(x) >= 0 && parseNum(x) < 24,
  'two digit hour between 1 and 23'
);

export const mm = datePart(
  x => x.length == 2 && parseNum(x) >= 0 && x < 60,
  'two digit minute between 00 and 59'
);

export const ss = datePart(
  x => x.length == 2 && x >= 0 && x < 60,
  'two digit second between 00 and 59'
);

export const date = parsely.parseStr([
  YYYY,
  dash,
  MM,
  dash,
  fp.flow(DD, parsely.onSuccess(x => x + ' ')),
  hh,
  colon,
  mm,
  colon,
  ss
]);

export const dateParser = (v: tokensToResult) =>
  parsely.parseStr([v, parsely.choice([gte, lte, gt, lt, equals]), date]);

export const offset: tokensToResult = parsely.matchValue('offset');

export const offsetParser = parsely.parseStr([offset, equals, number]);

export const limit: tokensToResult = parsely.matchValue('limit');

export const limitParser = parsely.parseStr([limit, equals, number]);

export const assign = (l: tokensToResult, r: tokensToResult): tokensToResult =>
  parsely.parseStr([l, equals, r]);

export const like = (l: tokensToResult, r: tokensToResult) =>
  parsely.parseStr([l, contains, r]);

export const starts = (l: tokensToResult, r: tokensToResult) =>
  parsely.parseStr([l, startsWith, r]);

export const ends = (l: tokensToResult, r: tokensToResult) =>
  parsely.parseStr([l, endsWith, r]);

export const valueSep = (v: tokensToResult): tokensToResult =>
  parsely.sepBy1(v)(sep);

export const list = (v: tokensToResult): tokensToResult =>
  parsely.parseStr([startList, valueSep(v), endList]);

export const inList = (l: tokensToResult, r: tokensToResult): tokensToResult =>
  parsely.parseStr([l, inToken, list(r)]);
