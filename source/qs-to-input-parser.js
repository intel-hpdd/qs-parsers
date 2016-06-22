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

import {curry, flow} from 'intel-fp';
import * as parsely from 'intel-parsely';
import type {tokensToResult} from 'intel-parsely';
import { YYYY, MM, DD, hh, mm, ss, dash, colon } from './input-to-qs-parser.js';
export {value, number, dot, dash} from './input-to-qs-parser.js';

const surround = curry(3, (open:string, close:string, str:string)  =>  open + str + close);
export const sep:tokensToResult = parsely.tokenTo(',', ', ');
export const valueSep = (v:tokensToResult):tokensToResult => flow(
  parsely.sepBy1(v, sep),
  parsely.onSuccess(surround('[', ']'))
);

export const and:tokensToResult = parsely.tokenTo('&', ' and ');

export const contains:tokensToResult = parsely.tokenTo('__contains', ' contains ');
export const startsWith:tokensToResult = parsely.tokenTo('__startswith', ' starts with ');
export const endsWith:tokensToResult = parsely.tokenTo('__endswith', ' ends with ');
export const equals:tokensToResult = parsely.tokenTo('=', ' = ');
export const equalsEmpty:tokensToResult = parsely.tokenTo('=', '');
export const inToken:tokensToResult = parsely.parseStr([
  parsely.tokenTo('__in', ' in '),
  equalsEmpty
]);
export const orderBy:tokensToResult = parsely.parseStr([
  parsely.tokenTo('order_by', ' order by '),
  equalsEmpty
]);

export const gte:tokensToResult = parsely.parseStr([
  parsely.tokenTo('__gte', ' >= '),
  equalsEmpty
]);
export const lte:tokensToResult = parsely.parseStr([
  parsely.tokenTo('__lte', ' <= '),
  equalsEmpty
]);
export const lt:tokensToResult = parsely.parseStr([
  parsely.tokenTo('__lt', ' < '),
  equalsEmpty
]);
export const gt:tokensToResult = parsely.parseStr([
  parsely.tokenTo('__gt', ' > '),
  equalsEmpty
]);

export const assign = (l:tokensToResult, r:tokensToResult) => parsely.parseStr([
  l,
  equals,
  r
]);

export const like = (l:tokensToResult, r:tokensToResult) => parsely.parseStr([
  l,
  contains,
  equalsEmpty,
  r
]);

export const starts = (l:tokensToResult, r:tokensToResult) => parsely.parseStr([
  l,
  startsWith,
  equalsEmpty,
  r
]);

export const ends = (l:tokensToResult, r:tokensToResult) => parsely.parseStr([
  l,
  endsWith,
  equalsEmpty,
  r
]);

export const inList = (l:tokensToResult, r:tokensToResult) => parsely.parseStr([
  l,
  inToken,
  valueSep(r)
]);


export const space:tokensToResult = parsely.tokenTo(' ', ' ');

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

export const orderByParser = (v:tokensToResult) => flow(
  parsely.parseStr([
    orderBy,
    parsely.choice([
      flow(
        parsely.parseStr([
          parsely.tokenTo('-', ''),
          v
        ]),
        parsely.onSuccess(x => x + ' desc ')
      ),
      flow(
        v,
        parsely.onSuccess(x => x + ' asc ')
      )
    ])
  ])
);
