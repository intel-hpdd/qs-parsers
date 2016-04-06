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
import type {tokens} from 'intel-parsely/get-lexer.js';

const eitherResult = curry(2, (fn:Function, x:{result:string}) => ({ ...x, result: either(fn, x.result) }));

const surround = curry(3, (open:string, close:string, str:string)  =>  open + str + close);

const parseStr = parsely.parse(always(''));
const equalsToken = parsely.token('equals');
const equals = equalsToken(always(' = '));
const contains = parsely.token('contains', always( ' contains ' ));
const endsWith = parsely.token('ends with', always( ' ends with ' ));
const value = parsely.token('value', x => x.content);
const inT = parsely.token('in', always(' in '));
const sep = parsely.token('sep', always(', '));

const valueSep = flow(
  parsely.sepBy1(value, sep),
  eitherResult(surround('[', ']'))
);

export type result = {
  tokens: tokens;
  consumed: number;
  result: string;
};

export type tokensToResult = (t:tokens) => result;

export const join:tokensToResult = parsely.token('join', always(' and '));
export const assign:tokensToResult = parseStr([value, equals, value]);
export const like:tokensToResult = parseStr([value, contains, equalsToken(always('')), value]);
export const ends:tokensToResult = parseStr([value, endsWith, equalsToken(always('')), value]);
export const inList:tokensToResult = parseStr([value, inT, equalsToken(always('')), valueSep]);
