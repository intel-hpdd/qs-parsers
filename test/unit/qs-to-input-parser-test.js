import {describe, it, expect} from '../jasmine.js';
import {join, assign, like, ends, inList} from '../../source/qs-to-input-parser.js';

describe('qs to input parser', () => {
  it('should parse join to and', () => {
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
        result: ' and '
      }
    );
  });

  it('should parse assign to human output', () => {
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
        result: 'a = b'
      }
    );
  });

  it('should parse contains to human output', () => {
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
        result: 'a contains b'
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
        result: 'a ends with b'
      }
    );
  });

  it('should parse inList to human output', () => {
    expect(
      inList(
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
        result: 'a in [b, c]'
      }
    );
  });
});
