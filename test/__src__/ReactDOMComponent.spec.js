import React from "../../src/React";
import {renderIntoDocument,Simulate} from '../utils'

describe('ReactComponent', () => {
  // var React;
  // var ReactTestUtils;
  // var React;
  // var ReactServer;
  var inputValueTracking;

  function normalizeCodeLocInfo(str) {
    return str && str.replace(/\(at .+?:\d+\)/g, '(at **)');
  }

  beforeEach(() => {
    // jasmine.resetModules();
    // React = require('react');
    // React = require('react-dom');
    // ReactServer = require('react-dom/server');
    // ReactTestUtils = require('react-dom/test-utils');
    // // TODO: can we express this test with only public API?
    inputValueTracking = {
      _getTrackerFromNode:function(node){
        return{
          getValue:function(){
            console.log(node)
            return node.value;
          }
        }
      }
    }
  });

  // describe('updateDOM', () => {
  //   it('should handle className', () => {
  //     var container = document.createElement('div');
  //     React.render(<div style={{}} />, container);

  //     React.render(<div className={'foo'} />, container);
  //     expect(container.firstChild.className).toEqual('foo');
  //     React.render(<div className={'bar'} />, container);
  //     expect(container.firstChild.className).toEqual('bar');
  //     React.render(<div className={null} />, container);
  //     expect(container.firstChild.className).toEqual('');
  //   });

  // });


  // describe('mountComponent', () => {
  //   var mountComponent;

  //   beforeEach(() => {
  //     mountComponent = function(props) {
  //       var container = document.createElement('div');
  //       React.render(<div {...props} />, container);
  //     };
  //   });


  //   it('should track input values', () => {
  //     var container = document.createElement('div');
  //     var inst = React.render(
  //       <input type="text" defaultValue="foo" />,
  //       container,
  //     );

  //     var tracker = inputValueTracking._getTrackerFromNode(inst);

  //     expect(tracker.getValue()).toEqual('foo');
  //   });

  //   it('should track textarea values', () => {
  //     var container = document.createElement('div');
  //     var inst = React.render(<textarea defaultValue="foo" />, container);
  //     var tracker = inputValueTracking._getTrackerFromNode(inst);
  //     expect(tracker.getValue()).toEqual('foo');
  //   });

    
  // });


  // describe('unmountComponent', () => {
  //   it('unmounts children before unsetting DOM node info', () => {
  //     class Inner extends React.Component {
  //       render() {
  //         return <span />;
  //       }

  //       componentWillUnmount() {
  //         // Should not throw
  //         expect(React.findDOMNode(this).nodeName).toBe('SPAN');
  //       }
  //     }

  //     var container = document.createElement('div');
  //     React.render(<div><Inner /></div>, container);
  //     React.unmountComponentAtNode(container);
  //   });
  // });

  // describe('tag sanitization', () => {
 

  //   it('should throw when an invalid tag name is used', () => {
  //     var hackzor = React.createElement('script tag');
  //     expect(() => renderIntoDocument(hackzor)).toThrow();
  //   });

  //   it('should throw when an attack vector is used', () => {
  //     var hackzor = React.createElement('div><img /><div');
  //     expect(() => renderIntoDocument(hackzor)).toThrow();
  //   });
  // });



  // describe('Attributes with aliases', function() {
    // it('sets aliased attributes on HTML attributes', function() {

    //   var el = renderIntoDocument(<div class="test" />);

    //   expect(el.className).toBe('test');

    // });

    // it('sets incorrectly cased aliased attributes on HTML attributes with a warning', function() {

    //   var el = renderIntoDocument(<div cLASS="test" />);

    //   expect(el.className).toBe('test');

    // });

    // it('sets aliased attributes on SVG elements with a warning', function() {
    //   spyOn(console, 'error');

    //   var el = renderIntoDocument(
    //     <svg><text arabic-form="initial" /></svg>,
    //   );
    //   var text = el.querySelector('text');

    //   expect(text.hasAttribute('arabic-form')).toBe(true);

    //   expectDev(console.error.calls.argsFor(0)[0]).toContain(
    //     'Warning: Invalid DOM property `arabic-form`. Did you mean `arabicForm`?',
    //   );
    // });

  //   it('sets aliased attributes on custom elements', function() {
  //     var el = renderIntoDocument(
  //       <div is="custom-element" class="test" />,
  //     );

  //     expect(el.getAttribute('class')).toBe('test');
  //   });

  //   it('aliased attributes on custom elements with bad casing', function() {
  //     var el = renderIntoDocument(
  //       <div is="custom-element" claSS="test" />,
  //     );

  //     expect(el.getAttribute('class')).toBe('test');
  //   });

  //   it('updates aliased attributes on custom elements', function() {
  //     var container = document.createElement('div');
  //     React.render(<div is="custom-element" class="foo" />, container);
  //     React.render(<div is="custom-element" class="bar" />, container);

  //     expect(container.firstChild.getAttribute('class')).toBe('bar');
  //   });
  // });

  // describe('Custom attributes', function() {
  //   it('allows assignment of custom attributes with string values', function() {
  //     var el = renderIntoDocument(<div whatever="30" />);

  //     expect(el.getAttribute('whatever')).toBe('30');
  //   });

  //   it('removes custom attributes', function() {
  //     const container = document.createElement('div');
  //     React.render(<div whatever="30" />, container);

  //     expect(container.firstChild.getAttribute('whatever')).toBe('30');

  //     React.render(<div whatever={null} />, container);

  //     expect(container.firstChild.hasAttribute('whatever')).toBe(true);
  //   });

  //   it('assigns a numeric custom attributes as a string', function() {
  //     var el = renderIntoDocument(<div whatever={3} />);

  //     expect(el.getAttribute('whatever')).toBe('3');
  //   });

  //   it('will not assign a function custom attributes', function() {

  //     var el = renderIntoDocument(<div whatever={() => {}} />);

  //     expect(el.hasAttribute('whatever')).toBe(false);

  //   });

  //   it('will assign an object custom attributes', function() {
  //     var el = renderIntoDocument(<div whatever={{}} />);
  //     expect(el.getAttribute('whatever')).toBe('[object Object]');
  //   });



  //   it('warns on NaN attributes', function() {

  //     var el = renderIntoDocument(<div whatever={NaN} />);

  //     expect(el.getAttribute('whatever')).toBe('NaN');
  //   });

  //   it('removes a property when it becomes invalid', function() {

  //     var container = document.createElement('div');
  //     React.render(<div whatever={0} />, container);
  //     React.render(<div whatever={() => {}} />, container);
  //     var el = container.firstChild;

  //     expect(el.hasAttribute('whatever')).toBe(false);
  //   });

  //   it('warns on bad casing of known HTML attributes', function() {

  //     var el = renderIntoDocument(<div SiZe="30" />);

  //     expect(el.getAttribute('size')).toBe('30');

  //   });
  // });

  describe('Object stringification', function() {
    it('allows objects on known properties', function() {
      var el = renderIntoDocument(<div acceptCharset={{}} />);
      expect(el.getAttribute('accept-charset')).toBe('[object Object]');
    });

    it('should pass objects as attributes if they define toString', () => {
      var obj = {
        toString() {
          return 'hello';
        },
      };
      var container = document.createElement('div');

      // React.render(<img src={obj} />, container);
      // console.log({img:container.firstChild})
      // expect(container.firstChild.src).toBe('hello');

      React.render(<svg arabicForm={obj} />, container);
      expect(container.firstChild.getAttribute('arabic-form')).toBe('hello');

      React.render(<div unknown={obj} />, container);
      expect(container.firstChild.getAttribute('unknown')).toBe('hello');
    });

    it('passes objects on known SVG attributes if they do not define toString', () => {
      var obj = {};
      var container = document.createElement('div');

      React.render(<svg arabicForm={obj} />, container);
      expect(container.firstChild.getAttribute('arabic-form')).toBe(
        '[object Object]',
      );
    });

    it('passes objects on custom attributes if they do not define toString', () => {
      var obj = {};
      var container = document.createElement('div');

      React.render(<div unknown={obj} />, container);
      expect(container.firstChild.getAttribute('unknown')).toBe(
        '[object Object]',
      );
    });

    // it('allows objects that inherit a custom toString method', function() {
    //   var parent = {toString: () => 'hello.jpg'};
    //   var child = Object.create(parent);
    //   var el = renderIntoDocument(<img src={child} />);

    //   expect(el.src).toBe('hello.jpg');
    // });

    it('assigns ajaxify (an important internal FB attribute)', function() {
      var options = {toString: () => 'ajaxy'};
      var el = renderIntoDocument(<div ajaxify={options} />);

      expect(el.getAttribute('ajaxify')).toBe('ajaxy');
    });
  });

  describe('String boolean attributes', function() {
    // it('does not assign string boolean attributes for custom attributes', function() {

    //   var el = renderIntoDocument(<div whatever={true} />);

    //   expect(el.hasAttribute('whatever')).toBe(false);

    // });

    it('stringifies the boolean true for allowed attributes', function() {
      var el = renderIntoDocument(<div spellCheck={true} />);

      expect(el.getAttribute('spellCheck')).toBe('true');
    });

    it('stringifies the boolean false for allowed attributes', function() {
      var el = renderIntoDocument(<div spellCheck={false} />);

      expect(el.getAttribute('spellCheck')).toBe('false');
    });

    it('stringifies implicit booleans for allowed attributes', function() {
      // eslint-disable-next-line react/jsx-boolean-value
      var el = renderIntoDocument(<div spellCheck />);

      expect(el.getAttribute('spellCheck')).toBe('true');
    });
  });

});
