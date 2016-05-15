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

import * as parsely from 'intel-parsely';

export const qsToInputTokens = [
  {
    name: ' ',
    pattern: /^%20/
  },
  {
    name: '&',
    pattern: /^&/
  },
  {
    name: '__in',
    pattern: /^__in/
  },
  {
    name: ',',
    pattern: /^,/
  },
  {
    name: '__contains',
    pattern: /^__contains/
  },
  {
    name: '__endswith',
    pattern: /^__endswith/
  },
  {
    name: 'order_by',
    pattern: /^order_by/
  },
  {
    name: '__gte',
    pattern: /^__gte/
  },
  {
    name: '__gt',
    pattern: /^__gt/
  },
  {
    name: '__lte',
    pattern: /^__lte/
  },
  {
    name: '__lt',
    pattern: /^__lt/
  },
  {
    name: 'number',
    pattern: /^\d+/
  },
  {
    name: '-',
    pattern: /^\-/
  },
  {
    name: ':',
    pattern: /^:/
  },
  {
    name: 'value',
    pattern: /^[a-zA-Z\d]+(_[a-zA-Z\d]+)?/
  },
  {
    name: '=',
    pattern: /^=/
  }
];

export const inputToQsTokens = [
  parsely.getLexer.whiteSpace,
  {
    name: 'and',
    pattern: /^and/
  },
  {
    name: 'contains',
    pattern: /^contains/
  },
  {
    name: 'ends with',
    pattern: /^ends with/
  },
  {
    name: 'order by',
    pattern: /^order by/
  },
  {
    name: '>',
    pattern: /^>/
  },
  {
    name: '>=',
    pattern: /^>=/
  },
  {
    name: '<',
    pattern: /^</
  },
  {
    name: '<=',
    pattern: /^<=/
  },
  {
    name: 'number',
    pattern: /^\d+/
  },
  {
    name: '-',
    pattern: /^\-/
  },
  {
    name: ':',
    pattern: /^:/
  },
  {
    name: 'value',
    pattern: /^[a-zA-Z_\d]+/
  },
  {
    name: '=',
    pattern: /^=/
  },
  {
    name: '[',
    pattern: /^\[/
  },
  {
    name: ']',
    pattern: /^]/
  },
  {
    name: ',',
    pattern: /^,/
  }
];
