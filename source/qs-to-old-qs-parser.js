// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
import * as parsely from '@iml/parsely';
import { dot, dash, YYYY, MM, DD, hh, mm, ss, colon } from './input-to-qs-parser.js';
import { space } from './qs-to-input-parser.js';
import type { tokensToResult } from '@iml/parsely';

const token = parsely.token(fp.always(true));

const equals: tokensToResult = token('=');
const contains: tokensToResult = token('__contains');
const startsWith: tokensToResult = token('__startswith');
const endsWith: tokensToResult = token('__endswith');
const value: tokensToResult = token('value');
const inT: tokensToResult = token('__in');
const sep: tokensToResult = token(',');
const number: tokensToResult = token('number');

export const orderBy: tokensToResult = parsely.parseStr([token('order_by'), equals]);

export const gte: tokensToResult = parsely.parseStr([token('__gte'), equals]);
export const lte: tokensToResult = parsely.parseStr([token('__lte'), equals]);
export const lt: tokensToResult = parsely.parseStr([token('__lt'), equals]);
export const gt: tokensToResult = parsely.parseStr([token('__gt'), equals]);

const valueOrNumberOrDotOrDash = parsely.choice([dot, dash, value, number]);

const valueSep: tokensToResult = parsely.sepBy1(valueOrNumberOrDotOrDash)(sep);
const inList: tokensToResult = parsely.parseStr([value, inT, equals, valueSep]);

export const orderByParser = parsely.parseStr([
  orderBy,
  parsely.choice([parsely.parseStr([token('-'), value]), value])
]);

export const utcFlag = parsely.matchValueTo('UTC', 'Z');
export const date = parsely.parseStr([YYYY, dash, MM, dash, DD, space, hh, colon, mm, colon, ss, utcFlag]);
export const dateParser = parsely.parseStr([value, parsely.choice([gte, lte, gt, lt, equals]), date]);

export const and: tokensToResult = token('&');
export const like: tokensToResult = parsely.parseStr([value, contains, equals, value]);
export const starts: tokensToResult = parsely.parseStr([
  value,
  startsWith,
  equals,
  parsely.many1(valueOrNumberOrDotOrDash)
]);
export const ends: tokensToResult = parsely.parseStr([value, endsWith, equals, value]);
export const assign: tokensToResult = parsely.parseStr([value, equals, parsely.many1(valueOrNumberOrDotOrDash)]);
export const inListOutOld: tokensToResult = fp.flow(
  inList,
  parsely.onSuccess(output => {
    const parts = output.split('=');
    const ins = parts[1].replace(/\[(.+)]/, '$1').split('%2C');

    return ins.map(x => `${parts[0]}=${x}`).join('&');
  })
);

const choices = parsely.choice([like, starts, ends, inListOutOld, dateParser, assign, orderByParser]);
const expr = parsely.sepBy1(choices)(and);
const emptyOrExpr = parsely.optional(expr);

export const parser = parsely.parseStr([emptyOrExpr, parsely.endOfString]);
