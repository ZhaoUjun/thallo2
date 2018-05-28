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

  describe('updateDOM', () => {
    it('should handle className', () => {
      var container = document.createElement('div');
      React.render(<div style={{}} />, container);

      React.render(<div className={'foo'} />, container);
      expect(container.firstChild.className).toEqual('foo');
      React.render(<div className={'bar'} />, container);
      expect(container.firstChild.className).toEqual('bar');
      React.render(<div className={null} />, container);
      expect(container.firstChild.className).toEqual('');
    });

  });


  describe('mountComponent', () => {
    var mountComponent;

    beforeEach(() => {
      mountComponent = function(props) {
        var container = document.createElement('div');
        React.render(<div {...props} />, container);
      };
    });


    it('should track input values', () => {
      var container = document.createElement('div');
      var inst = React.render(
        <input type="text" defaultValue="foo" />,
        container,
      );

      var tracker = inputValueTracking._getTrackerFromNode(inst);

      expect(tracker.getValue()).toEqual('foo');
    });

    it('should track textarea values', () => {
      var container = document.createElement('div');
      var inst = React.render(<textarea defaultValue="foo" />, container);
      var tracker = inputValueTracking._getTrackerFromNode(inst);
      expect(tracker.getValue()).toEqual('foo');
    });

    
  });

  // describe('updateComponent', () => {
  //   var container;

  //   beforeEach(() => {
  //     container = document.createElement('div');
  //   });

  //   it('should warn against children for void elements', () => {
  //     React.render(<input />, container);

  //     expect(function() {
  //       React.render(<input>children</input>, container);
  //     }).toThrowError(
  //       'input is a void element tag and must neither have `children` nor use ' +
  //         '`dangerouslySetInnerHTML`.',
  //     );
  //   });

  //   it('should warn against dangerouslySetInnerHTML for void elements', () => {
  //     React.render(<input />, container);

  //     expect(function() {
  //       React.render(
  //         <input dangerouslySetInnerHTML={{__html: 'content'}} />,
  //         container,
  //       );
  //     }).toThrowError(
  //       'input is a void element tag and must neither have `children` nor use ' +
  //         '`dangerouslySetInnerHTML`.',
  //     );
  //   });

  //   it('should validate against multiple children props', () => {
  //     React.render(<div />, container);

  //     expect(function() {
  //       React.render(
  //         <div children="" dangerouslySetInnerHTML={{__html: ''}} />,
  //         container,
  //       );
  //     }).toThrowError(
  //       'Can only set one of `children` or `props.dangerouslySetInnerHTML`.',
  //     );
  //   });

  //   it('should warn about contentEditable and children', () => {
  //     spyOn(console, 'error');
  //     React.render(<div contentEditable={true}><div /></div>, container);
  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(console.error.calls.argsFor(0)[0]).toContain('contentEditable');
  //   });

  //   it('should validate against invalid styles', () => {
  //     React.render(<div />, container);

  //     expect(function() {
  //       React.render(<div style={1} />, container);
  //     }).toThrowError(
  //       'The `style` prop expects a mapping from style properties to values, ' +
  //         "not a string. For example, style={{marginRight: spacing + 'em'}} " +
  //         'when using JSX.',
  //     );
  //   });

  //   it('should report component containing invalid styles', () => {
  //     class Animal extends React.Component {
  //       render() {
  //         return <div style={1} />;
  //       }
  //     }

  //     let caughtErr;
  //     try {
  //       React.render(<Animal />, container);
  //     } catch (err) {
  //       caughtErr = err;
  //     }

  //     expect(caughtErr).not.toBe(undefined);
  //     expect(normalizeCodeLocInfo(caughtErr.message)).toContain(
  //       'The `style` prop expects a mapping from style properties to values, ' +
  //         "not a string. For example, style={{marginRight: spacing + 'em'}} " +
  //         'when using JSX.' +
  //         '\n    in div (at **)' +
  //         '\n    in Animal (at **)',
  //     );
  //   });

  //   it('should properly escape text content and attributes values', () => {
  //     expect(
  //       ReactServer.renderToStaticMarkup(
  //         React.createElement(
  //           'div',
  //           {
  //             title: '\'"<>&',
  //             style: {
  //               textAlign: '\'"<>&',
  //             },
  //           },
  //           '\'"<>&',
  //         ),
  //       ),
  //     ).toBe(
  //       '<div title="&#x27;&quot;&lt;&gt;&amp;" style="text-align:&#x27;&quot;&lt;&gt;&amp;">' +
  //         '&#x27;&quot;&lt;&gt;&amp;' +
  //         '</div>',
  //     );
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
  //   it('should throw when an invalid tag name is used server-side', () => {
  //     var hackzor = React.createElement('script tag');
  //     expect(() => ReactServer.renderToString(hackzor)).toThrowError(
  //       'Invalid tag: script tag',
  //     );
  //   });

  //   it('should throw when an attack vector is used server-side', () => {
  //     var hackzor = React.createElement('div><img /><div');
  //     expect(() => ReactServer.renderToString(hackzor)).toThrowError(
  //       'Invalid tag: div><img /><div',
  //     );
  //   });

  //   it('should throw when an invalid tag name is used', () => {
  //     var hackzor = React.createElement('script tag');
  //     expect(() => renderIntoDocument(hackzor)).toThrow();
  //   });

  //   it('should throw when an attack vector is used', () => {
  //     var hackzor = React.createElement('div><img /><div');
  //     expect(() => renderIntoDocument(hackzor)).toThrow();
  //   });
  // });

  // describe('nesting validation', () => {
  //   it('warns on invalid nesting', () => {
  //     spyOn(console, 'error');
  //     renderIntoDocument(<div><tr /><tr /></div>);

  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(normalizeCodeLocInfo(console.error.calls.argsFor(0)[0])).toBe(
  //       'Warning: validateDOMNesting(...): <tr> cannot appear as a child of ' +
  //         '<div>.' +
  //         '\n    in tr (at **)' +
  //         '\n    in div (at **)',
  //     );
  //   });

  //   it('warns on invalid nesting at root', () => {
  //     spyOn(console, 'error');
  //     var p = document.createElement('p');
  //     React.render(<span><p /></span>, p);

  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(normalizeCodeLocInfo(console.error.calls.argsFor(0)[0])).toBe(
  //       'Warning: validateDOMNesting(...): <p> cannot appear as a descendant ' +
  //         'of <p>.' +
  //         // There is no outer `p` here because root container is not part of the stack.
  //         '\n    in p (at **)' +
  //         '\n    in span (at **)',
  //     );
  //   });

  //   it('warns nicely for table rows', () => {
  //     spyOn(console, 'error');

  //     class Row extends React.Component {
  //       render() {
  //         return <tr>x</tr>;
  //       }
  //     }

  //     class Foo extends React.Component {
  //       render() {
  //         return <table><Row /> </table>;
  //       }
  //     }

  //     renderIntoDocument(<Foo />);
  //     expectDev(console.error.calls.count()).toBe(3);

  //     expectDev(normalizeCodeLocInfo(console.error.calls.argsFor(0)[0])).toBe(
  //       'Warning: validateDOMNesting(...): <tr> cannot appear as a child of ' +
  //         '<table>. Add a <tbody> to your code to match the DOM tree generated ' +
  //         'by the browser.' +
  //         '\n    in tr (at **)' +
  //         '\n    in Row (at **)' +
  //         '\n    in table (at **)' +
  //         '\n    in Foo (at **)',
  //     );

  //     expectDev(normalizeCodeLocInfo(console.error.calls.argsFor(1)[0])).toBe(
  //       'Warning: validateDOMNesting(...): Text nodes cannot appear as a ' +
  //         'child of <tr>.' +
  //         '\n    in tr (at **)' +
  //         '\n    in Row (at **)' +
  //         '\n    in table (at **)' +
  //         '\n    in Foo (at **)',
  //     );

  //     expectDev(normalizeCodeLocInfo(console.error.calls.argsFor(2)[0])).toBe(
  //       'Warning: validateDOMNesting(...): Whitespace text nodes cannot ' +
  //         "appear as a child of <table>. Make sure you don't have any extra " +
  //         'whitespace between tags on each line of your source code.' +
  //         '\n    in table (at **)' +
  //         '\n    in Foo (at **)',
  //     );
  //   });

  //   it('gives useful context in warnings', () => {
  //     spyOn(console, 'error');
  //     function Row() {
  //       return <tr />;
  //     }
  //     function FancyRow() {
  //       return <Row />;
  //     }

  //     class Table extends React.Component {
  //       render() {
  //         return <table>{this.props.children}</table>;
  //       }
  //     }

  //     class FancyTable extends React.Component {
  //       render() {
  //         return <Table>{this.props.children}</Table>;
  //       }
  //     }

  //     function Viz1() {
  //       return <table><FancyRow /></table>;
  //     }
  //     function App1() {
  //       return <Viz1 />;
  //     }
  //     renderIntoDocument(<App1 />);
  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(
  //       normalizeCodeLocInfo(console.error.calls.argsFor(0)[0]),
  //     ).toContain(
  //       '\n    in tr (at **)' +
  //         '\n    in Row (at **)' +
  //         '\n    in FancyRow (at **)' +
  //         '\n    in table (at **)' +
  //         '\n    in Viz1 (at **)',
  //     );

  //     function Viz2() {
  //       return <FancyTable><FancyRow /></FancyTable>;
  //     }
  //     function App2() {
  //       return <Viz2 />;
  //     }
  //     renderIntoDocument(<App2 />);
  //     expectDev(console.error.calls.count()).toBe(2);
  //     expectDev(
  //       normalizeCodeLocInfo(console.error.calls.argsFor(1)[0]),
  //     ).toContain(
  //       '\n    in tr (at **)' +
  //         '\n    in Row (at **)' +
  //         '\n    in FancyRow (at **)' +
  //         '\n    in table (at **)' +
  //         '\n    in Table (at **)' +
  //         '\n    in FancyTable (at **)' +
  //         '\n    in Viz2 (at **)',
  //     );

  //     renderIntoDocument(<FancyTable><FancyRow /></FancyTable>);
  //     expectDev(console.error.calls.count()).toBe(3);
  //     expectDev(
  //       normalizeCodeLocInfo(console.error.calls.argsFor(2)[0]),
  //     ).toContain(
  //       '\n    in tr (at **)' +
  //         '\n    in Row (at **)' +
  //         '\n    in FancyRow (at **)' +
  //         '\n    in table (at **)' +
  //         '\n    in Table (at **)' +
  //         '\n    in FancyTable (at **)',
  //     );

  //     renderIntoDocument(<table><FancyRow /></table>);
  //     expectDev(console.error.calls.count()).toBe(4);
  //     expectDev(
  //       normalizeCodeLocInfo(console.error.calls.argsFor(3)[0]),
  //     ).toContain(
  //       '\n    in tr (at **)' +
  //         '\n    in Row (at **)' +
  //         '\n    in FancyRow (at **)' +
  //         '\n    in table (at **)',
  //     );

  //     renderIntoDocument(<FancyTable><tr /></FancyTable>);
  //     expectDev(console.error.calls.count()).toBe(5);
  //     expectDev(
  //       normalizeCodeLocInfo(console.error.calls.argsFor(4)[0]),
  //     ).toContain(
  //       '\n    in tr (at **)' +
  //         '\n    in table (at **)' +
  //         '\n    in Table (at **)' +
  //         '\n    in FancyTable (at **)',
  //     );

  //     class Link extends React.Component {
  //       render() {
  //         return <a>{this.props.children}</a>;
  //       }
  //     }

  //     renderIntoDocument(<Link><div><Link /></div></Link>);
  //     expectDev(console.error.calls.count()).toBe(6);
  //     expectDev(
  //       normalizeCodeLocInfo(console.error.calls.argsFor(5)[0]),
  //     ).toContain(
  //       '\n    in a (at **)' +
  //         '\n    in Link (at **)' +
  //         '\n    in div (at **)' +
  //         '\n    in a (at **)' +
  //         '\n    in Link (at **)',
  //     );
  //   });

  //   it('should warn about incorrect casing on properties (ssr)', () => {
  //     spyOn(console, 'error');
  //     ReactServer.renderToString(
  //       React.createElement('input', {type: 'text', tabindex: '1'}),
  //     );
  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(console.error.calls.argsFor(0)[0]).toContain('tabIndex');
  //   });

  //   it('should warn about incorrect casing on event handlers (ssr)', () => {
  //     spyOn(console, 'error');
  //     ReactServer.renderToString(
  //       React.createElement('input', {type: 'text', onclick: '1'}),
  //     );
  //     ReactServer.renderToString(
  //       React.createElement('input', {type: 'text', onKeydown: '1'}),
  //     );
  //     expectDev(console.error.calls.count()).toBe(2);
  //     expectDev(console.error.calls.argsFor(0)[0]).toContain('onClick');
  //     expectDev(console.error.calls.argsFor(1)[0]).toContain('onKeyDown');
  //   });

  //   it('should warn about incorrect casing on properties', () => {
  //     spyOn(console, 'error');
  //     renderIntoDocument(
  //       React.createElement('input', {type: 'text', tabindex: '1'}),
  //     );
  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(console.error.calls.argsFor(0)[0]).toContain('tabIndex');
  //   });

  //   it('should warn about incorrect casing on event handlers', () => {
  //     spyOn(console, 'error');
  //     renderIntoDocument(
  //       React.createElement('input', {type: 'text', onclick: '1'}),
  //     );
  //     renderIntoDocument(
  //       React.createElement('input', {type: 'text', onKeydown: '1'}),
  //     );
  //     expectDev(console.error.calls.count()).toBe(2);
  //     expectDev(console.error.calls.argsFor(0)[0]).toContain('onClick');
  //     expectDev(console.error.calls.argsFor(1)[0]).toContain('onKeyDown');
  //   });

  //   it('should warn about class', () => {
  //     spyOn(console, 'error');
  //     renderIntoDocument(
  //       React.createElement('div', {class: 'muffins'}),
  //     );
  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(console.error.calls.argsFor(0)[0]).toContain('className');
  //   });

  //   it('should warn about class (ssr)', () => {
  //     spyOn(console, 'error');
  //     ReactServer.renderToString(
  //       React.createElement('div', {class: 'muffins'}),
  //     );
  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(console.error.calls.argsFor(0)[0]).toContain('className');
  //   });

  //   it('should warn about props that are no longer supported', () => {
  //     spyOn(console, 'error');
  //     renderIntoDocument(<div />);
  //     expectDev(console.error.calls.count()).toBe(0);

  //     renderIntoDocument(<div onFocusIn={() => {}} />);
  //     expectDev(console.error.calls.count()).toBe(1);

  //     renderIntoDocument(<div onFocusOut={() => {}} />);
  //     expectDev(console.error.calls.count()).toBe(2);
  //   });

  //   it('should warn about props that are no longer supported without case sensitivity', () => {
  //     spyOn(console, 'error');
  //     renderIntoDocument(<div />);
  //     expectDev(console.error.calls.count()).toBe(0);

  //     renderIntoDocument(<div onfocusin={() => {}} />);
  //     expectDev(console.error.calls.count()).toBe(1);

  //     renderIntoDocument(<div onfocusout={() => {}} />);
  //     expectDev(console.error.calls.count()).toBe(2);
  //   });

  //   it('should warn about props that are no longer supported (ssr)', () => {
  //     spyOn(console, 'error');
  //     ReactServer.renderToString(<div />);
  //     expectDev(console.error.calls.count()).toBe(0);

  //     ReactServer.renderToString(<div onFocusIn={() => {}} />);
  //     expectDev(console.error.calls.count()).toBe(1);

  //     ReactServer.renderToString(<div onFocusOut={() => {}} />);
  //     expectDev(console.error.calls.count()).toBe(2);
  //   });

  //   it('should warn about props that are no longer supported without case sensitivity (ssr)', () => {
  //     spyOn(console, 'error');
  //     ReactServer.renderToString(<div />);
  //     expectDev(console.error.calls.count()).toBe(0);

  //     ReactServer.renderToString(<div onfocusin={() => {}} />);
  //     expectDev(console.error.calls.count()).toBe(1);

  //     ReactServer.renderToString(<div onfocusout={() => {}} />);
  //     expectDev(console.error.calls.count()).toBe(2);
  //   });

  //   it('gives source code refs for unknown prop warning', () => {
  //     spyOn(console, 'error');
  //     renderIntoDocument(<div class="paladin" />);
  //     renderIntoDocument(<input type="text" onclick="1" />);
  //     expectDev(console.error.calls.count()).toBe(2);
  //     expectDev(normalizeCodeLocInfo(console.error.calls.argsFor(0)[0])).toBe(
  //       'Warning: Invalid DOM property `class`. Did you mean `className`?\n    in div (at **)',
  //     );
  //     expectDev(normalizeCodeLocInfo(console.error.calls.argsFor(1)[0])).toBe(
  //       'Warning: Invalid event handler property `onclick`. Did you mean ' +
  //         '`onClick`?\n    in input (at **)',
  //     );
  //   });

  //   it('gives source code refs for unknown prop warning (ssr)', () => {
  //     spyOn(console, 'error');
  //     ReactServer.renderToString(<div class="paladin" />);
  //     ReactServer.renderToString(<input type="text" onclick="1" />);
  //     expectDev(console.error.calls.count()).toBe(2);
  //     expectDev(normalizeCodeLocInfo(console.error.calls.argsFor(0)[0])).toBe(
  //       'Warning: Invalid DOM property `class`. Did you mean `className`?\n    in div (at **)',
  //     );
  //     expectDev(normalizeCodeLocInfo(console.error.calls.argsFor(1)[0])).toBe(
  //       'Warning: Invalid event handler property `onclick`. Did you mean ' +
  //         '`onClick`?\n    in input (at **)',
  //     );
  //   });

  //   it('gives source code refs for unknown prop warning for update render', () => {
  //     spyOn(console, 'error');
  //     var container = document.createElement('div');

  //     renderIntoDocument(<div className="paladin" />, container);
  //     expectDev(console.error.calls.count()).toBe(0);

  //     renderIntoDocument(<div class="paladin" />, container);
  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(normalizeCodeLocInfo(console.error.calls.argsFor(0)[0])).toBe(
  //       'Warning: Invalid DOM property `class`. Did you mean `className`?\n    in div (at **)',
  //     );
  //   });

  //   it('gives source code refs for unknown prop warning for exact elements', () => {
  //     spyOn(console, 'error');

  //     renderIntoDocument(
  //       <div className="foo1">
  //         <div class="foo2" />
  //         <div onClick={() => {}} />
  //         <div onclick={() => {}} />
  //         <div className="foo5" />
  //         <div className="foo6" />
  //       </div>,
  //     );

  //     expectDev(console.error.calls.count()).toBe(2);

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain('className');
  //     var matches = console.error.calls.argsFor(0)[0].match(/.*\(.*:(\d+)\).*/);
  //     var previousLine = matches[1];

  //     expectDev(console.error.calls.argsFor(1)[0]).toContain('onClick');
  //     matches = console.error.calls.argsFor(1)[0].match(/.*\(.*:(\d+)\).*/);
  //     var currentLine = matches[1];

  //     //verify line number has a proper relative difference,
  //     //since hard coding the line number would make test too brittle
  //     expect(parseInt(previousLine, 10) + 2).toBe(parseInt(currentLine, 10));
  //   });

  //   it('gives source code refs for unknown prop warning for exact elements (ssr)', () => {
  //     spyOn(console, 'error');

  //     ReactServer.renderToString(
  //       <div className="foo1">
  //         <div class="foo2" />
  //         <div onClick="foo3" />
  //         <div onclick="foo4" />
  //         <div className="foo5" />
  //         <div className="foo6" />
  //       </div>,
  //     );

  //     expectDev(console.error.calls.count()).toBe(2);

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain('className');
  //     var matches = console.error.calls.argsFor(0)[0].match(/.*\(.*:(\d+)\).*/);
  //     var previousLine = (matches || [])[1];

  //     expectDev(console.error.calls.argsFor(1)[0]).toContain('onClick');
  //     matches = console.error.calls.argsFor(1)[0].match(/.*\(.*:(\d+)\).*/) || {
  //     };
  //     var currentLine = (matches || [])[1];

  //     //verify line number has a proper relative difference,
  //     //since hard coding the line number would make test too brittle
  //     expectDev(parseInt(previousLine, 10) + 2).toBe(parseInt(currentLine, 10));
  //   });

  //   it('gives source code refs for unknown prop warning for exact elements in composition', () => {
  //     spyOn(console, 'error');
  //     var container = document.createElement('div');

  //     class Parent extends React.Component {
  //       render() {
  //         return <div><Child1 /><Child2 /><Child3 /><Child4 /></div>;
  //       }
  //     }

  //     class Child1 extends React.Component {
  //       render() {
  //         return <div class="paladin">Child1</div>;
  //       }
  //     }

  //     class Child2 extends React.Component {
  //       render() {
  //         return <div>Child2</div>;
  //       }
  //     }

  //     class Child3 extends React.Component {
  //       render() {
  //         return <div onclick="1">Child3</div>;
  //       }
  //     }

  //     class Child4 extends React.Component {
  //       render() {
  //         return <div>Child4</div>;
  //       }
  //     }

  //     renderIntoDocument(<Parent />, container);

  //     expectDev(console.error.calls.count()).toBe(2);

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain('className');
  //     var matches = console.error.calls.argsFor(0)[0].match(/.*\(.*:(\d+)\).*/);
  //     var previousLine = (matches || [])[1];

  //     expectDev(console.error.calls.argsFor(1)[0]).toContain('onClick');
  //     matches = console.error.calls.argsFor(1)[0].match(/.*\(.*:(\d+)\).*/);
  //     var currentLine = (matches || [])[1];

  //     //verify line number has a proper relative difference,
  //     //since hard coding the line number would make test too brittle
  //     expect(parseInt(previousLine, 10) + 12).toBe(parseInt(currentLine, 10));
  //   });

  //   it('gives source code refs for unknown prop warning for exact elements in composition (ssr)', () => {
  //     spyOn(console, 'error');
  //     var container = document.createElement('div');

  //     class Parent extends React.Component {
  //       render() {
  //         return <div><Child1 /><Child2 /><Child3 /><Child4 /></div>;
  //       }
  //     }

  //     class Child1 extends React.Component {
  //       render() {
  //         return <div class="paladin">Child1</div>;
  //       }
  //     }

  //     class Child2 extends React.Component {
  //       render() {
  //         return <div>Child2</div>;
  //       }
  //     }

  //     class Child3 extends React.Component {
  //       render() {
  //         return <div onclick="1">Child3</div>;
  //       }
  //     }

  //     class Child4 extends React.Component {
  //       render() {
  //         return <div>Child4</div>;
  //       }
  //     }

  //     ReactServer.renderToString(<Parent />, container);

  //     expectDev(console.error.calls.count()).toBe(2);

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain('className');
  //     var matches = console.error.calls.argsFor(0)[0].match(/.*\(.*:(\d+)\).*/);
  //     var previousLine = (matches || [])[1];

  //     expectDev(console.error.calls.argsFor(1)[0]).toContain('onClick');
  //     matches = console.error.calls.argsFor(1)[0].match(/.*\(.*:(\d+)\).*/);
  //     var currentLine = (matches || [])[1];

  //     //verify line number has a proper relative difference,
  //     //since hard coding the line number would make test too brittle
  //     expectDev(parseInt(previousLine, 10) + 12).toBe(
  //       parseInt(currentLine, 10),
  //     );
  //   });

  //   it('should suggest property name if available', () => {
  //     spyOn(console, 'error');

  //     renderIntoDocument(
  //       React.createElement('label', {for: 'test'}),
  //     );
  //     renderIntoDocument(
  //       React.createElement('input', {type: 'text', autofocus: true}),
  //     );

  //     expectDev(console.error.calls.count()).toBe(2);

  //     expectDev(console.error.calls.argsFor(0)[0]).toBe(
  //       'Warning: Invalid DOM property `for`. Did you mean `htmlFor`?\n    in label',
  //     );

  //     expectDev(console.error.calls.argsFor(1)[0]).toBe(
  //       'Warning: Invalid DOM property `autofocus`. Did you mean `autoFocus`?\n    in input',
  //     );
  //   });

  //   it('should suggest property name if available (ssr)', () => {
  //     spyOn(console, 'error');

  //     ReactServer.renderToString(
  //       React.createElement('label', {for: 'test'}),
  //     );
  //     ReactServer.renderToString(
  //       React.createElement('input', {type: 'text', autofocus: true}),
  //     );

  //     expectDev(console.error.calls.count()).toBe(2);

  //     expectDev(console.error.calls.argsFor(0)[0]).toBe(
  //       'Warning: Invalid DOM property `for`. Did you mean `htmlFor`?\n    in label',
  //     );

  //     expectDev(console.error.calls.argsFor(1)[0]).toBe(
  //       'Warning: Invalid DOM property `autofocus`. Did you mean `autoFocus`?\n    in input',
  //     );
  //   });
  // });

  // describe('whitespace', () => {
  //   it('renders innerHTML and preserves whitespace', () => {
  //     const container = document.createElement('div');
  //     const html = '\n  \t  <span>  \n  testContent  \t  </span>  \n  \t';
  //     const elem = <div dangerouslySetInnerHTML={{__html: html}} />;

  //     React.render(elem, container);
  //     expect(container.firstChild.innerHTML).toBe(html);
  //   });

  //   it('render and then updates innerHTML and preserves whitespace', () => {
  //     const container = document.createElement('div');
  //     const html = '\n  \t  <span>  \n  testContent1  \t  </span>  \n  \t';
  //     const elem = <div dangerouslySetInnerHTML={{__html: html}} />;
  //     React.render(elem, container);

  //     const html2 = '\n  \t  <div>  \n  testContent2  \t  </div>  \n  \t';
  //     const elem2 = <div dangerouslySetInnerHTML={{__html: html2}} />;
  //     React.render(elem2, container);

  //     expect(container.firstChild.innerHTML).toBe(html2);
  //   });
  // });

  // describe('Attributes with aliases', function() {
  //   it('sets aliased attributes on HTML attributes', function() {
  //     spyOn(console, 'error');

  //     var el = renderIntoDocument(<div class="test" />);

  //     expect(el.className).toBe('test');

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Invalid DOM property `class`. Did you mean `className`?',
  //     );
  //   });

  //   it('sets incorrectly cased aliased attributes on HTML attributes with a warning', function() {
  //     spyOn(console, 'error');

  //     var el = renderIntoDocument(<div cLASS="test" />);

  //     expect(el.className).toBe('test');

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Invalid DOM property `cLASS`. Did you mean `className`?',
  //     );
  //   });

  //   it('sets aliased attributes on SVG elements with a warning', function() {
  //     spyOn(console, 'error');

  //     var el = renderIntoDocument(
  //       <svg><text arabic-form="initial" /></svg>,
  //     );
  //     var text = el.querySelector('text');

  //     expect(text.hasAttribute('arabic-form')).toBe(true);

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Invalid DOM property `arabic-form`. Did you mean `arabicForm`?',
  //     );
  //   });

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

  //     expect(container.firstChild.hasAttribute('whatever')).toBe(false);
  //   });

  //   it('does not assign a boolean custom attributes as a string', function() {
  //     spyOn(console, 'error');

  //     var el = renderIntoDocument(<div whatever={true} />);

  //     expect(el.hasAttribute('whatever')).toBe(false);

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Received `true` for non-boolean attribute `whatever`',
  //     );
  //   });

  //   it('does not assign an implicit boolean custom attributes', function() {
  //     spyOn(console, 'error');

  //     // eslint-disable-next-line react/jsx-boolean-value
  //     var el = renderIntoDocument(<div whatever />);

  //     expect(el.hasAttribute('whatever')).toBe(false);

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Received `true` for non-boolean attribute `whatever`',
  //     );
  //   });

  //   it('assigns a numeric custom attributes as a string', function() {
  //     var el = renderIntoDocument(<div whatever={3} />);

  //     expect(el.getAttribute('whatever')).toBe('3');
  //   });

  //   it('will not assign a function custom attributes', function() {
  //     spyOn(console, 'error');

  //     var el = renderIntoDocument(<div whatever={() => {}} />);

  //     expect(el.hasAttribute('whatever')).toBe(false);

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Invalid value for prop `whatever` on <div> tag',
  //     );
  //   });

  //   it('will assign an object custom attributes', function() {
  //     var el = renderIntoDocument(<div whatever={{}} />);
  //     expect(el.getAttribute('whatever')).toBe('[object Object]');
  //   });

  //   it('allows cased data attributes', function() {
  //     spyOn(console, 'error');

  //     var el = renderIntoDocument(<div data-fooBar="true" />);
  //     expect(el.getAttribute('data-foobar')).toBe('true');

  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(
  //       normalizeCodeLocInfo(console.error.calls.argsFor(0)[0]),
  //     ).toMatch(
  //       'React does not recognize the `data-fooBar` prop on a DOM element. ' +
  //         'If you intentionally want it to appear in the DOM as a custom ' +
  //         'attribute, spell it as lowercase `data-foobar` instead. ' +
  //         'If you accidentally passed it from a parent component, remove ' +
  //         'it from the DOM element.\n' +
  //         '    in div (at **)',
  //     );
  //   });

  //   it('allows cased custom attributes', function() {
  //     spyOn(console, 'error');

  //     var el = renderIntoDocument(<div fooBar="true" />);
  //     expect(el.getAttribute('foobar')).toBe('true');

  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(
  //       normalizeCodeLocInfo(console.error.calls.argsFor(0)[0]),
  //     ).toMatch(
  //       'React does not recognize the `fooBar` prop on a DOM element. ' +
  //         'If you intentionally want it to appear in the DOM as a custom ' +
  //         'attribute, spell it as lowercase `foobar` instead. ' +
  //         'If you accidentally passed it from a parent component, remove ' +
  //         'it from the DOM element.\n' +
  //         '    in div (at **)',
  //     );
  //   });

  //   it('warns on NaN attributes', function() {
  //     spyOn(console, 'error');

  //     var el = renderIntoDocument(<div whatever={NaN} />);

  //     expect(el.getAttribute('whatever')).toBe('NaN');

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Received NaN for numeric attribute `whatever`. If this is ' +
  //         'expected, cast the value to a string.\n    in div',
  //     );
  //   });

  //   it('removes a property when it becomes invalid', function() {
  //     spyOn(console, 'error');

  //     var container = document.createElement('div');
  //     React.render(<div whatever={0} />, container);
  //     React.render(<div whatever={() => {}} />, container);
  //     var el = container.firstChild;

  //     expect(el.hasAttribute('whatever')).toBe(false);

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Invalid value for prop `whatever` on <div> tag.',
  //     );
  //   });

  //   it('warns on bad casing of known HTML attributes', function() {
  //     spyOn(console, 'error');

  //     var el = renderIntoDocument(<div SiZe="30" />);

  //     expect(el.getAttribute('size')).toBe('30');

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Invalid DOM property `SiZe`. Did you mean `size`?',
  //     );
  //   });
  // });

  // describe('Object stringification', function() {
  //   it('allows objects on known properties', function() {
  //     var el = renderIntoDocument(<div acceptCharset={{}} />);
  //     expect(el.getAttribute('accept-charset')).toBe('[object Object]');
  //   });

  //   it('should pass objects as attributes if they define toString', () => {
  //     var obj = {
  //       toString() {
  //         return 'hello';
  //       },
  //     };
  //     var container = document.createElement('div');

  //     React.render(<img src={obj} />, container);
  //     expect(container.firstChild.src).toBe('hello');

  //     React.render(<svg arabicForm={obj} />, container);
  //     expect(container.firstChild.getAttribute('arabic-form')).toBe('hello');

  //     React.render(<div unknown={obj} />, container);
  //     expect(container.firstChild.getAttribute('unknown')).toBe('hello');
  //   });

  //   it('passes objects on known SVG attributes if they do not define toString', () => {
  //     var obj = {};
  //     var container = document.createElement('div');

  //     React.render(<svg arabicForm={obj} />, container);
  //     expect(container.firstChild.getAttribute('arabic-form')).toBe(
  //       '[object Object]',
  //     );
  //   });

  //   it('passes objects on custom attributes if they do not define toString', () => {
  //     var obj = {};
  //     var container = document.createElement('div');

  //     React.render(<div unknown={obj} />, container);
  //     expect(container.firstChild.getAttribute('unknown')).toBe(
  //       '[object Object]',
  //     );
  //   });

  //   it('allows objects that inherit a custom toString method', function() {
  //     var parent = {toString: () => 'hello.jpg'};
  //     var child = Object.create(parent);
  //     var el = renderIntoDocument(<img src={child} />);

  //     expect(el.src).toBe('hello.jpg');
  //   });

  //   it('assigns ajaxify (an important internal FB attribute)', function() {
  //     var options = {toString: () => 'ajaxy'};
  //     var el = renderIntoDocument(<div ajaxify={options} />);

  //     expect(el.getAttribute('ajaxify')).toBe('ajaxy');
  //   });
  // });

  // describe('String boolean attributes', function() {
  //   it('does not assign string boolean attributes for custom attributes', function() {
  //     spyOn(console, 'error');

  //     var el = renderIntoDocument(<div whatever={true} />);

  //     expect(el.hasAttribute('whatever')).toBe(false);

  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Received `true` for non-boolean attribute `whatever`.',
  //     );
  //   });

  //   it('stringifies the boolean true for allowed attributes', function() {
  //     var el = renderIntoDocument(<div spellCheck={true} />);

  //     expect(el.getAttribute('spellCheck')).toBe('true');
  //   });

  //   it('stringifies the boolean false for allowed attributes', function() {
  //     var el = renderIntoDocument(<div spellCheck={false} />);

  //     expect(el.getAttribute('spellCheck')).toBe('false');
  //   });

  //   it('stringifies implicit booleans for allowed attributes', function() {
  //     // eslint-disable-next-line react/jsx-boolean-value
  //     var el = renderIntoDocument(<div spellCheck />);

  //     expect(el.getAttribute('spellCheck')).toBe('true');
  //   });
  // });

  // describe('Hyphenated SVG elements', function() {
  //   it('the font-face element is not a custom element', function() {
  //     spyOn(console, 'error');
  //     var el = renderIntoDocument(
  //       <svg><font-face x-height={false} /></svg>,
  //     );

  //     expect(el.querySelector('font-face').hasAttribute('x-height')).toBe(
  //       false,
  //     );

  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Invalid DOM property `x-height`. Did you mean `xHeight`',
  //     );
  //   });

  //   it('the font-face element does not allow unknown boolean values', function() {
  //     spyOn(console, 'error');
  //     var el = renderIntoDocument(
  //       <svg><font-face whatever={false} /></svg>,
  //     );

  //     expect(el.querySelector('font-face').hasAttribute('whatever')).toBe(
  //       false,
  //     );

  //     expectDev(console.error.calls.count()).toBe(1);
  //     expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //       'Warning: Received `false` for non-boolean attribute `whatever`.',
  //     );
  //   });
  // });

});
