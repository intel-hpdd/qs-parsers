import {describe, it, expect} from '../jasmine.js';
import * as inputToQs from '../../source/input-to-qs-parser.js';

describe('input to qs parser', () => {
  it('should parse join to &', () => {
    expect(
      inputToQs.join(
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
        tokens: [],
        suggest: [],
        consumed: 1,
        result: '&'
      }
    );
  });

  it('should parse value to itself', () => {
    expect(
      inputToQs.value(
        [
          {
            content: 'foo',
            name: 'value',
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
        result: 'foo'
      }
    );
  });

  it('should parse equals to itself', () => {
    expect(
      inputToQs.equals(
        [
          {
            content: '=',
            name: 'equals',
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
        result: '='
      }
    );
  });

  it('should parse contains to __contains', () => {
    expect(
      inputToQs.contains(
        [
          {
            content: 'contains',
            name: 'contains',
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
        result: '__contains='
      }
    );
  });

  it('should parse endsWith to __endswith', () => {
    expect(
      inputToQs.endsWith(
        [
          {
            content: 'ends with',
            name: 'ends with',
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
        result: '__endswith='
      }
    );
  });

  it('should parse in to __in', () => {
    expect(
      inputToQs.inToken(
        [
          {
            content: 'in',
            name: 'value',
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
        result: '__in='
      }
    );
  });

  it('should parse startList to nothing', () => {
    expect(
      inputToQs.startList(
        [
          {
            content: '[',
            name: 'startList',
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
        result: ''
      }
    );
  });

  it('should parse endList to nothing', () => {
    expect(
      inputToQs.endList(
        [
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
        suggest: [],
        consumed: 1,
        result: ''
      }
    );
  });

  it('should parse sep to ,', () => {
    expect(
      inputToQs.sep(
        [
          {
            content: ',',
            name: 'sep',
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
        result: ','
      }
    );
  });

  it('should parse valueSep', () => {
    expect(
      inputToQs.valueSep(
        [
          {
            content: 'foo',
            name: 'value',
            character: 7
          },
          {
            content: ',',
            name: 'sep',
            character: 10
          },
          {
            content: 'bar',
            name: 'value',
            character: 11
          }
        ]
      )
    )
    .toEqual(
      {
        tokens: [],
        suggest: [],
        consumed: 3,
        result: 'foo,bar'
      }
    );
  });

  it('should parse a list', () => {
    expect(
      inputToQs.list(
        [
          {
            content: '[',
            name: 'startList',
            character: 6
          },
          {
            content: 'foo',
            name: 'value',
            character: 7
          },
          {
            content: ',',
            name: 'sep',
            character: 10
          },
          {
            content: 'bar',
            name: 'value',
            character: 11
          },
          {
            content: ']',
            name: 'endList',
            character: 12
          }
        ]
      )
    )
    .toEqual(
      {
        tokens: [],
        suggest: [],
        consumed: 5,
        result: 'foo,bar'
      }
    );
  });
});
