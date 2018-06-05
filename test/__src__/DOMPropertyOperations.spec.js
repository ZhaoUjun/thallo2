import React from "../../src/React";
import {renderIntoDocument} from '../utils'

describe('DOMPropertyOperations', () => {

  describe('setValueForProperty', () => {
    it('should set values as properties by default', () => {
      var container = document.createElement('div');
      React.render(<div title="Tip!" />, container);
      expect(container.firstChild.title).toBe('Tip!');
    });

    it('should set values as attributes if necessary', () => {
      var container = document.createElement('div');
      React.render(<div role="#" />, container);
      expect(container.firstChild.getAttribute('role')).toBe('#');
      expect(container.firstChild.role).toBeUndefined();
    });

    // it('should set values as namespace attributes if necessary', () => {
    //   var container = document.createElement('svg');
    //   React.render(<image xlinkHref="about:blank" />, container);
    //   expect(
    //     container.firstChild.getAttributeNS(
    //       'http://www.w3.org/1999/xlink',
    //       'href',
    //     ),
    //   ).toBe('about:blank');
    // });

    it('should set values as boolean properties', () => {
      var container = document.createElement('div');
      React.render(<div disabled="disabled" />, container);
      expect(container.firstChild.getAttribute('disabled')).toBe('');
      React.render(<div disabled={true} />, container);
      expect(container.firstChild.getAttribute('disabled')).toBe('');
      React.render(<div disabled={false} />, container);
      expect(container.firstChild.getAttribute('disabled')).toBe(null);
      React.render(<div disabled={true} />, container);
      React.render(<div disabled={null} />, container);
      expect(container.firstChild.getAttribute('disabled')).toBe(null);
      React.render(<div disabled={true} />, container);
      React.render(<div disabled={undefined} />, container);
      expect(container.firstChild.getAttribute('disabled')).toBe(null);
    });

    it('should convert attribute values to string first', () => {
      // Browsers default to this behavior, but some test environments do not.
      // This ensures that we have consistent behavior.
      var obj = {
        toString: function() {
          return 'css-class';
        },
      };

      var container = document.createElement('div');
      React.render(<div className={obj} />, container);
      expect(container.firstChild.getAttribute('class')).toBe('css-class');
    });

    it('should not remove empty attributes for special properties', () => {
      var container = document.createElement('div');
      React.render(<input value="" />, container);
      expect(container.firstChild.getAttribute('value')).toBe('');
      expect(container.firstChild.value).toBe('');
    });

    it('should remove for falsey boolean properties', () => {
      var container = document.createElement('div');
      React.render(<div allowFullScreen={false} />, container);
      expect(container.firstChild.hasAttribute('allowFullScreen')).toBe(false);
    });

    it('should remove when setting custom attr to null', () => {
      var container = document.createElement('div');
      React.render(<div data-foo="bar" />, container);
      expect(container.firstChild.hasAttribute('data-foo')).toBe(true);
      React.render(<div data-foo={null} />, container);
      expect(container.firstChild.hasAttribute('data-foo')).toBe(false);
    });

    it('should set className to empty string instead of null', () => {
      var container = document.createElement('div');
      React.render(<div className="selected" />, container);
      expect(container.firstChild.className).toBe('selected');
      React.render(<div className={null} />, container);
      // className should be '', not 'null' or null (which becomes 'null' in
      // some browsers)
      expect(container.firstChild.className).toBe('');
      expect(container.firstChild.getAttribute('class')).toBe(null);
    });

    it('should remove property properly for boolean properties', () => {
      var container = document.createElement('div');
      React.render(<div hidden={true} />, container);
      expect(container.firstChild.hasAttribute('hidden')).toBe(true);
      React.render(<div hidden={false} />, container);
      expect(container.firstChild.hasAttribute('hidden')).toBe(false);
    });
  });

  describe('value mutation method', function() {
    it('should update an empty attribute to zero', function() {
      var container = document.createElement('div');
      React.render(
        <input type="radio" value="" onChange={function() {}} />,
        container,
      );
      spyOn(container.firstChild, 'setAttribute');
      React.render(
        <input type="radio" value={0} onChange={function() {}} />,
        container,
      );
      expect(container.firstChild.setAttribute.calls.count()).toBe(1);
    });

    it('should always assign the value attribute for non-inputs', function() {
      var container = document.createElement('div');
      React.render(<progress />, container);
      spyOn(container.firstChild, 'setAttribute');
      React.render(<progress value={30} />, container);
      React.render(<progress value="30" />, container);
      expect(container.firstChild.setAttribute.calls.count()).toBe(2);
    });
  });

  describe('deleteValueForProperty', () => {
    it('should remove attributes for normal properties', () => {
      var container = document.createElement('div');
      React.render(<div title="foo" />, container);
      expect(container.firstChild.getAttribute('title')).toBe('foo');
      React.render(<div />, container);
      expect(container.firstChild.getAttribute('title')).toBe(null);
    });

    // it('should not remove attributes for special properties', () => {
      //@not-support
      // var container = document.createElement('div');
      // spyOn(console, 'error');
      // React.render(
      //   <input type="text" value="foo" onChange={function() {}} />,
      //   container,
      // );
      // expect(container.firstChild.getAttribute('value')).toBe('foo');
      // expect(container.firstChild.value).toBe('foo');
      // React.render(
      //   <input type="text" onChange={function() {}} />,
      //   container,
      // );
      // expect(container.firstChild.getAttribute('value')).toBe('foo');
      // expect(container.firstChild.value).toBe('foo');
      // expect(console.error.calls.count()).toBe(1);
      // expect(console.error.calls.argsFor(0)[0]).toContain(
      //   'A component is changing a controlled input of type text to be uncontrolled',
      // );
    // });
  });
});
