// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
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


import {always, flow} from 'intel-fp';
import * as parsely from 'intel-parsely';
import type {tokensToResult} from 'intel-parsely';

const token = parsely.token(always(true));
const successTxt = txt => parsely.onSuccess(always(txt));


export const value:tokensToResult = token('value');
export const number:tokensToResult = token('number');

export const inToken:tokensToResult = parsely.matchValueTo('in', '__in=');

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

export const gte:tokensToResult = flow(
  parsely.parseStr([
    gt,
    equals
  ]),
  successTxt('__gte='),
  parsely.onError(e => e.adjust(['>=']))
);

export const lt = parsely.tokenTo('<', '__lt=');

export const lte:tokensToResult = flow(
  parsely.parseStr([
    lt,
    equals
  ]),
  successTxt('__lte='),
  parsely.onError(e => e.adjust(['<=']))
);

export const dash = parsely.tokenTo('-', '-');

export const colon = parsely.tokenTo(':', ':');

export const orderBy = parsely.tokenTo('order by', 'order_by=');

export const desc:tokensToResult = parsely.matchValueTo('desc', '-');

export const asc:tokensToResult = parsely.matchValueTo('asc', '');

export const ascOrDesc:tokensToResult = parsely.choice([
  asc,
  desc
]);

const datePart = (cond:Function, expected:string):tokensToResult => flow(
  parsely.token(
    cond,
    'number'
  ),
  parsely.onError(e => e.adjust([expected]))
);

const parseNum = n => parseInt(n, 10);

export const YYYY = datePart(
  x => x.length === 4,
  'four digit year'
);

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
  flow(
    DD,
    parsely.onSuccess(x => x + ' ')
  ),
  hh,
  colon,
  mm,
  colon,
  ss
]);

export const dateParser = (v:tokensToResult) => parsely.parseStr([
  v,
  parsely.choice([
    gte,
    lte,
    gt,
    lt,
    equals
  ]),
  date
]);

export const offset:tokensToResult = parsely.matchValue('offset');

export const offsetParser = parsely.parseStr([
  offset,
  equals,
  number
]);

export const limit:tokensToResult = parsely.matchValue('limit');

export const limitParser = parsely.parseStr([
  limit,
  equals,
  number
]);

export const assign = (l:tokensToResult, r:tokensToResult):tokensToResult => parsely.parseStr([
  l,
  equals,
  r
]);

export const like = (l:tokensToResult, r:tokensToResult) => parsely.parseStr([
  l,
  contains,
  r
]);

export const starts = (l:tokensToResult, r:tokensToResult) => parsely.parseStr([
  l,
  startsWith,
  r
]);

export const ends = (l:tokensToResult, r:tokensToResult) => parsely.parseStr([
  l,
  endsWith,
  r
]);

export const valueSep = (v:tokensToResult):tokensToResult => parsely.sepBy1(
  v,
  sep
);

export const list = (v:tokensToResult):tokensToResult => parsely.parseStr([
  startList,
  valueSep(v),
  endList
]);

export const inList = (l:tokensToResult, r:tokensToResult):tokensToResult => parsely.parseStr([
  l,
  inToken,
  list(r)
]);
