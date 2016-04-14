import {describe, it, expect} from '../jasmine.js';
import {join, assign, like, ends, inListOutOld} from '../../source/qs-to-old-qs-parser.js';

describe('qs to old qs parser', () => {
  it('should parse join to itself', () => {
    expect(
      join(
        [
          {
            content: '&',
            name: 'join',
            character: 10
          }
        ]
      )
    )
    .toEqual(
      {
        tokens: [],
        suggest: [],
        consumed: 1,
        result: '&'
      }
    );
  });

  it('should parse assign to itself', () => {
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
        tokens: [],
        suggest: [],
        consumed: 3,
        result: 'a=b'
      }
    );
  });

  it('should parse contains to itself', () => {
    expect(
      like(
        [
          {
            content: 'a',
            name: 'value',
            character: 1
          },
          {
            content: '__contains',
            name: 'contains',
            character: 2
          },
          {
            content: '=',
            name: 'equals',
            character: 11
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
        suggest: [],
        consumed: 4,
        result: 'a__contains=b'
      }
    );
  });

  it('should parse ends to human output', () => {
    expect(
      ends(
        [
          {
            content: 'a',
            name: 'value',
            character: 1
          },
          {
            content: '__endswith',
            name: 'ends with',
            character: 2
          },
          {
            content: '=',
            name: 'equals',
            character: 11
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
        suggest: [],
        consumed: 4,
        result: 'a__endswith=b'
      }
    );
  });

  it('should parse inListOutOld to human output', () => {
    expect(
      inListOutOld(
        [
          {
            content: 'a',
            name: 'value',
            character: 1
          },
          {
            content: '__in',
            name: 'in',
            character: 2
          },
          {
            content: '=',
            name: 'equals',
            character: 6
          },
          {
            content: 'b',
            name: 'value',
            character: 7
          },
          {
            content: ',',
            name: 'sep',
            character: 8
          },
          {
            content: 'c',
            name: 'value',
            character: 9
          }
        ]
      )
    )
    .toEqual(
      {
        tokens: [],
        suggest: [],
        consumed: 6,
        result: 'a__in=b&a__in=c'
      }
    );
  });
});
