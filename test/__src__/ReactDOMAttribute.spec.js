import React from "../../src/React";
import {renderIntoDocument,Simulate} from '../utils'

describe('ReactDOM unknown attribute', () => {

  function normalizeCodeLocInfo(str) {
    return str && str.replace(/\(at .+?:\d+\)/g, '(at **)');
  }

  function testUnknownAttributeRemoval(givenValue) {
    var el = document.createElement('div');
    React.render(<div unknown="something" />, el);
    expect(el.firstChild.getAttribute('unknown')).toBe('something');
    React.render(<div unknown={givenValue} />, el);
    expect(el.firstChild.hasAttribute('unknown')).toBe(false);
  }

  function testUnknownAttributeAssignment(givenValue, expectedDOMValue) {
    var el = document.createElement('div');
    React.render(<div unknown="something" />, el);
    expect(el.firstChild.getAttribute('unknown')).toBe('something');
    React.render(<div unknown={givenValue} />, el);
    expect(el.firstChild.getAttribute('unknown')).toBe(expectedDOMValue);
  }

  describe('unknown attributes', () => {
    it('removes values null and undefined', () => {
      testUnknownAttributeRemoval(null);
      testUnknownAttributeRemoval(undefined);
    });

    it('changes values true, false to null, and also warns once', () => {
      testUnknownAttributeAssignment(true, null);
      testUnknownAttributeAssignment(false, null);
    });

    it('removes unknown attributes that were rendered but are now missing', () => {
      var el = document.createElement('div');
      React.render(<div unknown="something" />, el);
      expect(el.firstChild.getAttribute('unknown')).toBe('something');
      React.render(<div />, el);
      expect(el.firstChild.hasAttribute('unknown')).toBe(false);
    });

    it('passes through strings', () => {
      testUnknownAttributeAssignment('a string', 'a string');
    });

    it('coerces numbers to strings', () => {
      testUnknownAttributeAssignment(0, '0');
      testUnknownAttributeAssignment(-1, '-1');
      testUnknownAttributeAssignment(42, '42');
      testUnknownAttributeAssignment(9000.99, '9000.99');
    });

    it('coerces NaN to strings and warns', () => {


      testUnknownAttributeAssignment(NaN, 'NaN');
    });

    it('coerces objects to strings and warns', () => {
      const lol = {
        toString() {
          return 'lol';
        },
      };

      testUnknownAttributeAssignment({hello: 'world'}, '[object Object]');
      testUnknownAttributeAssignment(lol, 'lol');
    });

    it('removes symbols and warns', () => {
      testUnknownAttributeRemoval(Symbol('foo'));
    });

    it('removes functions and warns', () => {

      testUnknownAttributeRemoval(function someFunction() {});
  
    });

    it('allows camelCase unknown attributes and warns', () => {

      var el = document.createElement('div');
      React.render(<div helloWorld="something" />, el);
      expect(el.firstChild.getAttribute('hello-world')).toBe('something');
    });
  });
});
