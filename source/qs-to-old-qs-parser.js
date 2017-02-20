// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2017 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

import * as fp from '@iml/fp';
import * as parsely from '@iml/parsely';
import { date } from './qs-to-input-parser.js';
import { dot, dash } from './input-to-qs-parser.js';
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

export const orderBy: tokensToResult = parsely.parseStr([
  token('order_by'),
  equals
]);

export const gte: tokensToResult = parsely.parseStr([token('__gte'), equals]);
export const lte: tokensToResult = parsely.parseStr([token('__lte'), equals]);
export const lt: tokensToResult = parsely.parseStr([token('__lt'), equals]);
export const gt: tokensToResult = parsely.parseStr([token('__gt'), equals]);

const valueOrNumberOrDotOrDash = parsely.choice([dot, dash, value, number]);

const valueSep: tokensToResult = parsely.sepBy1(valueOrNumberOrDotOrDash, sep);
const inList: tokensToResult = parsely.parseStr([value, inT, equals, valueSep]);

export const orderByParser = parsely.parseStr([
  orderBy,
  parsely.choice([parsely.parseStr([token('-'), value]), value])
]);

export const dateParser = parsely.parseStr([
  value,
  parsely.choice([gte, lte, gt, lt, equals]),
  date
]);

export const and: tokensToResult = token('&');
export const like: tokensToResult = parsely.parseStr([
  value,
  contains,
  equals,
  value
]);
export const starts: tokensToResult = parsely.parseStr([
  value,
  startsWith,
  equals,
  parsely.many1(valueOrNumberOrDotOrDash)
]);
export const ends: tokensToResult = parsely.parseStr([
  value,
  endsWith,
  equals,
  value
]);
export const assign: tokensToResult = parsely.parseStr([
  value,
  equals,
  parsely.many1(valueOrNumberOrDotOrDash)
]);
export const inListOutOld: tokensToResult = fp.flow(
  inList,
  parsely.onSuccess(output => {
    const parts = output.split('=');
    const ins = parts[1].replace(/\[(.+)]/, '$1').split('%2C');

    return ins.map(x => `${parts[0]}=${x}`).join('&');
  })
);

const choices = parsely.choice([
  like,
  starts,
  ends,
  inListOutOld,
  dateParser,
  assign,
  orderByParser
]);
const expr = parsely.sepBy1(choices, and);
const emptyOrExpr = parsely.optional(expr);

export const parser = parsely.parseStr([emptyOrExpr, parsely.endOfString]);
