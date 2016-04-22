import {describe, it, expect} from '../jasmine.js';
import {qsToInputTokens, inputToQsTokens} from '../../source/tokens.js';

describe('tokens', () => {
  it('should have tokens for qs to input', () => {
    expect(qsToInputTokens).toEqual([
      {
        name: 'whiteSpace',
        pattern: /^[ \t\n]+/,
        ignore: true
      },
      {
        name: 'join',
        pattern: /^&/
      },
      {
        name: 'in',
        pattern: /^__in/
      },
      {
        name: 'sep',
        pattern: /^,/
      },
      {
        name: 'contains',
        pattern: /^__contains/
      },
      {
        name: 'ends with',
        pattern: /^__endswith/
      },
      {
        name: 'value',
        pattern: /^[a-zA-Z\d]+(_[a-zA-Z\d]+)?/
      },
      {
        name: 'equals',
        pattern: /^=/
      }
    ]);
  });

  it('should have tokens for input to qs', () => {
    expect(inputToQsTokens).toEqual([
      {
        name: 'whiteSpace',
        pattern: /^[ \t\n]+/,
        ignore: true
      },
      {
        name: 'join',
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
        name: 'value',
        pattern: /^[a-zA-Z_\d]+/
      },
      {
        name: 'equals',
        pattern: /^=/
      },
      {
        name: 'startList',
        pattern: /^\[/
      },
      {
        name: 'endList',
        pattern: /^]/
      },
      {
        name: 'sep',
        pattern: /^,/
      }
    ]);
  });
});
