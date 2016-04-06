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

import {view, lensProp, always} from 'intel-fp';
import * as parsely from 'intel-parsely';

import type {tokensToResult} from './qs-to-input-parser.js';

const parseToStr = parsely.parse(always(''));
const value = parsely.token('value', view(lensProp('content')));
const equals = parsely.token('equals', always('='));
const contains = parsely.token('contains', always('__contains='));
const endsWith = parsely.token('ends with', always('__endswith='));
const inToken = parsely.token('in', always('__in='));
const startList = parsely.token('startList', always(''));
const endList = parsely.token('endList', always(''));
const sep = parsely.token('sep', always(','));
const valueSep = parsely.sepBy1(value, sep);
const list = parseToStr([startList, valueSep, endList]);

export const assign:tokensToResult = parseToStr([value, equals, value]);
export const like:tokensToResult = parseToStr([value, contains, value]);
export const ends:tokensToResult = parseToStr([value, endsWith, value]);
export const inList:tokensToResult = parseToStr([value, inToken, list]);
export const join:tokensToResult = parsely.token('join', always('&'));
