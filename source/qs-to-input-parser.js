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

import {curry, always, flow, either} from 'intel-fp';
import * as parsely from 'intel-parsely';
import type {tokensToResult} from 'intel-parsely';

const eitherResult = curry(2, (fn:Function, x:{result:string}) => ({
  ...x,
  result: either(fn, x.result)
}));

const surround = curry(3, (open:string, close:string, str:string)  =>  open + str + close);
const equalsToken:(fn:Function) => tokensToResult = parsely.token('equals');

export const equals:tokensToResult = equalsToken(always(' = '));
export const equalsEmpty:tokensToResult = equalsToken(always(''));
export const contains:tokensToResult = parsely.token(
  'contains',
  always( ' contains ' )
);
export const endsWith:tokensToResult = parsely.token(
  'ends with',
  always( ' ends with ' )
);
export const value:tokensToResult = parsely.token(
  'value',
  x => x.content
);
export const inToken:tokensToResult = parsely.token(
  'in',
  always(' in ')
);
export const sep:tokensToResult = parsely.token(
  'sep',
  always(', ')
);
export const valueSep:tokensToResult = flow(
  parsely.sepBy1(value, sep),
  eitherResult(surround('[', ']'))
);
export const join:tokensToResult = parsely.token(
  'join',
  always(' and ')
);
