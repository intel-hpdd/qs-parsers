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

import {always, flow,  __, either, curry} from 'intel-fp';
import * as parsely from 'intel-parsely';

import type {tokensToResult} from './qs-to-input-parser.js';

const eitherResult = curry(2, (fn:Function, x:{result: String}) => ({ ...x, result: either(fn, x.result) }));

const contentToken = parsely.token(__, x => x.content);
const parseStr = parsely.parse(always(''));
const equals = contentToken('equals');
const contains = contentToken('contains');
const endsWith = contentToken('ends with');
const value = contentToken('value');
const inT = contentToken('in');
const sep = contentToken('sep');

const valueSep = parsely.sepBy1(value, sep);
const inList = parseStr([value, inT, equals, valueSep]);

export const like:tokensToResult = parseStr([value, contains, equals, value]);
export const ends:tokensToResult = parseStr([value, endsWith, equals, value]);
export const assign:tokensToResult = parseStr([value, equals, value]);
export const inListOutOld:tokensToResult = flow(inList, eitherResult(output => {
  const parts = output.split('=');
  const ins = parts[1]
    .replace(/\[(.+)]/, '$1')
    .split(',');

  return ins
    .map(x => `${parts[0]}=${x}`)
    .join('&');
}));
export const join:tokensToResult = contentToken('join');
