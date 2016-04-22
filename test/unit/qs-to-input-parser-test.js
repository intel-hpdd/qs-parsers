import {describe, it, expect} from '../jasmine.js';
import * as qsToInput from '../../source/qs-to-input-parser.js';

describe('qs to input parser', () => {
  it('should parse join to and', () => {
    expect(
      qsToInput.join(
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

  it('should parse equals to itself', () => {
    expect(
      qsToInput.equals(
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
        result: ' = '
      }
    );
  });

  it('should parse equalsEmpty to nothing', () => {
    expect(
      qsToInput.equalsEmpty(
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
        result: ''
      }
    );
  });

  it('should parse contains to itself', () => {
    expect(
      qsToInput.contains(
        [
          {
            content: '__contains',
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
        result: ' contains '
      }
    );
  });

  it('should parse endsWith to itself', () => {
    expect(
      qsToInput.endsWith(
        [
          {
            content: '__endswith',
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
        result: ' ends with '
      }
    );
  });

  it('should parse value to itself', () => {
    expect(
      qsToInput.value(
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

  it('should parse in to itself', () => {
    expect(
      qsToInput.inToken(
        [
          {
            content: '__in',
            name: 'in',
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
        result: ' in '
      }
    );
  });

  it('should parse sep to itself', () => {
    expect(
      qsToInput.sep(
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
        result: ', '
      }
    );
  });

  it('should parse valueSep', () => {
    expect(
      qsToInput.valueSep(
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
        result: '[foo, bar]'
      }
    );
  });
});
