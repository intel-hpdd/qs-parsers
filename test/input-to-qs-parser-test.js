import {describe, it, expect} from './jasmine.js';
import {join, assign, like, ends, inList} from '../source/input-to-qs-parser.js';

describe('input to qs parser', () => {
  it('should parse join to &', () => {
    expect(
      join(
        [
          {
            content: 'and',
            name: 'join',
            character: 10
          }
        ]
      )
    )
    .toEqual(
      {
        tokens: [  ],
        consumed: 1,
        result: '&'
      }
    );
  });

  it('should parse assign to qs output', () => {
    expect(
      assign(
        [
          {
            content: 'a',
            name: 'value',
            character: 1
          },
          {
            content: '=',
            name: 'equals',
            character: 2
          },
          {
            content: 'b',
            name: 'value',
            character: 3
          }
        ]
      )
    )
    .toEqual(
      {
        tokens: [  ],
        consumed: 3,
        result: 'a=b'
      }
    );
  });

  it('should parse contains to qs output', () => {
    expect(
      like(
        [
          {
            content: 'a',
            name: 'value',
            character: 1
          },
          {
            content: 'contains',
            name: 'contains',
            character: 2
          },
          {
            content: 'b',
            name: 'value',
            character: 12
          }
        ]
      )
    )
    .toEqual(
      {
        tokens: [],
        consumed: 3,
        result: 'a__contains=b'
      }
    );
  });

  it('should parse ends to qs output', () => {
    expect(
      ends(
        [
          {
            content: 'a',
            name: 'value',
            character: 1
          },
          {
            content: 'ends with',
            name: 'ends with',
            character: 2
          },
          {
            content: 'b',
            name: 'value',
            character: 12
          }
        ]
      )
    )
    .toEqual(
      {
        tokens: [],
        consumed: 3,
        result: 'a__endswith=b'
      }
    );
  });

  it('should parse inList to qs output', () => {
    expect(
      inList(
        [
          {
            content: 'a',
            name: 'value',
            character: 1
          },
          {
            content: 'in',
            name: 'in',
            character: 2
          },
          {
            content: '[',
            name: 'startList',
            character: 4
          },
          {
            content: 'c',
            name: 'value',
            character: 9
          },
          {
            content: ',',
            name: 'sep',
            character: 8
          },
          {
            content: 'd',
            name: 'value',
            character: 9
          },
          {
            content: ']',
            name: 'endList',
            character: 10
          }
        ]
      )
    )
    .toEqual(
      {
        tokens: [],
        consumed: 7,
        result: 'a__in=c,d'
      }
    );
  });
});
