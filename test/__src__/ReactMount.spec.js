import React from "../../src/React";
import {renderIntoDocument} from '../utils'
import {HTMLNodeType} from '../../src/constant'

describe('ReactMount', () => {
  
  describe('unmountComponentAtNode', () => {
    it('throws when given a non-node', () => {
      var nodeArray = document.getElementsByTagName('div');
      expect(function() {
        React.unmountComponentAtNode(nodeArray);
      }).toThrowError(
        'unmountComponentAtNode(...): Target container is not a DOM element.',
      );
    });

    it('returns false on non-React containers', () => {
      var d = document.createElement('div');
      d.innerHTML = '<b>hellooo</b>';
      expect(React.unmountComponentAtNode(d)).toBe(false);
      expect(d.textContent).toBe('hellooo');
    });

    it('returns true on React containers', () => {
      var d = document.createElement('div');
      React.render(<b>hellooo</b>, d);
      expect(d.textContent).toBe('hellooo');
      expect(React.unmountComponentAtNode(d)).toBe(true);
      expect(d.textContent).toBe('');
    });
  });

  // it('warns when given a factory', () => {
  //   spyOn(console, 'error');
  //   class Component extends React.Component {
  //     render() {
  //       return <div />;
  //     }
  //   }

  //   renderIntoDocument(Component);
  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //     'Functions are not valid as a React child. ' +
  //       'This may happen if you return a Component instead of <Component /> from render. ' +
  //       'Or maybe you meant to call this function rather than return it.',
  //   );
  // });

  it('should render different components in same root', () => {
    var container = document.createElement('container');
    document.body.appendChild(container);

    React.render(<div />, container);
    expect(container.firstChild.nodeName).toBe('DIV');

    React.render(<span />, container);
    expect(container.firstChild.nodeName).toBe('SPAN');
  });

  it('should unmount and remount if the key changes', () => {
    var container = document.createElement('container');

    var mockMount = jasmine.createSpy();
    var mockUnmount = jasmine.createSpy();

    class Component extends React.Component {
      componentDidMount = mockMount;
      componentWillUnmount = mockUnmount;
      render() {
        return <span>{this.props.text}</span>;
      }
    }

    expect(mockMount.calls.count()).toBe(0);
    expect(mockUnmount.calls.count()).toBe(0);

    React.render(<Component text="orange" key="A" />, container);
    expect(container.firstChild.innerHTML).toBe('orange');
    expect(mockMount.calls.count()).toBe(1);
    expect(mockUnmount.calls.count()).toBe(0);

    // If we change the key, the component is unmounted and remounted
    React.render(<Component text="green" key="B" />, container);
    expect(container.firstChild.innerHTML).toBe('green');
    expect(mockMount.calls.count()).toBe(2);
    expect(mockUnmount.calls.count()).toBe(1);

    // But if we don't change the key, the component instance is reused
    React.render(<Component text="blue" key="B" />, container);
    expect(container.firstChild.innerHTML).toBe('blue');
    expect(mockMount.calls.count()).toBe(2);
    expect(mockUnmount.calls.count()).toBe(1);
  });

  it('should reuse markup if rendering to the same target twice', () => {
    var container = document.createElement('container');
    var instance1 = React.render(<div />, container);
    var instance2 = React.render(<div />, container);

    expect(instance1 === instance2).toBe(true);
  });

  // it('should warn if mounting into left padded rendered markup', () => {
  //   var container = document.createElement('container');
  //   container.innerHTML = ReactDOMServer.renderToString(<div />) + ' ';

  //   spyOn(console, 'error');
  //   React.hydrate(<div />, container);
  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //     'Did not expect server HTML to contain the text node " " in <container>.',
  //   );
  // });

  // it('should warn if mounting into right padded rendered markup', () => {
  //   var container = document.createElement('container');
  //   container.innerHTML = ' ' + ReactDOMServer.renderToString(<div />);

  //   spyOn(console, 'error');
  //   React.hydrate(<div />, container);
  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //     'Did not expect server HTML to contain the text node " " in <container>.',
  //   );
  // });

  // it('should not warn if mounting into non-empty node', () => {
  //   var container = document.createElement('container');
  //   container.innerHTML = '<div></div>';

  //   spyOn(console, 'error');
  //   React.render(<div />, container);
  //   expectDev(console.error.calls.count()).toBe(0);
  // });

  // it('should warn when mounting into document.body', () => {
  //   var iFrame = document.createElement('iframe');
  //   document.body.appendChild(iFrame);
  //   spyOn(console, 'error');

  //   React.render(<div />, iFrame.contentDocument.body);

  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //     'Rendering components directly into document.body is discouraged',
  //   );
  // });

  // it('should account for escaping on a checksum mismatch', () => {
  //   var div = document.createElement('div');
  //   var markup = ReactDOMServer.renderToString(
  //     <div>This markup contains an nbsp entity: &nbsp; server text</div>,
  //   );
  //   div.innerHTML = markup;

  //   spyOn(console, 'error');
  //   React.hydrate(
  //     <div>This markup contains an nbsp entity: &nbsp; client text</div>,
  //     div,
  //   );
  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //     'Server: "This markup contains an nbsp entity:   server text" ' +
  //       'Client: "This markup contains an nbsp entity:   client text"',
  //   );
  // });

  // it('should warn if render removes React-rendered children', () => {
  //   var container = document.createElement('container');

  //   class Component extends React.Component {
  //     render() {
  //       return <div><div /></div>;
  //     }
  //   }

  //   React.render(<Component />, container);

  //   // Test that blasting away children throws a warning
  //   spyOn(console, 'error');
  //   var rootNode = container.firstChild;
  //   React.render(<span />, rootNode);
  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toBe(
  //     'Warning: render(...): Replacing React-rendered children with a new ' +
  //       'root component. If you intended to update the children of this node, ' +
  //       'you should instead have the existing children update their state and ' +
  //       'render the new components instead of calling React.render.',
  //   );
  // });

  // it('should warn if the unmounted node was rendered by another copy of React', () => {
  //   // jest.resetModules();
  //   // var ReactDOMOther = require('react-dom');
  //   var container = document.createElement('div');

  //   class Component extends React.Component {
  //     render() {
  //       return <div><div /></div>;
  //     }
  //   }

  //   React.render(<Component />, container);
  //   // Make sure React and ReactDOMOther are different copies
  //   expect(React).not.toEqual(ReactDOMOther);

  //   // spyOn(console, 'error');
  //   // ReactDOMOther.unmountComponentAtNode(container);
  //   // expectDev(console.error.calls.count()).toBe(1);
  //   // expectDev(console.error.calls.argsFor(0)[0]).toBe(
  //   //   "Warning: unmountComponentAtNode(): The node you're attempting to unmount " +
  //   //     'was rendered by another copy of React.',
  //   // );

  //   // // Don't throw a warning if the correct React copy unmounts the node
  //   // React.unmountComponentAtNode(container);
  //   // expectDev(console.error.calls.count()).toBe(1);
  // });

  it('passes the correct callback context', () => {
    var container = document.createElement('div');
    var calls = 0;

    React.render(<div />, container, function() {
      expect(this.nodeName).toBe('DIV');
      calls++;
    });

    // Update, no type change
    React.render(<div />, container, function() {
      expect(this.nodeName).toBe('DIV');
      calls++;
    });

    // Update, type change
    React.render(<span />, container, function() {
      expect(this.nodeName).toBe('SPAN');
      calls++;
    });

    // Batched update, no type change
    // React.unstable_batchedUpdates(function() {
    //   React.render(<span />, container, function() {
    //     expect(this.nodeName).toBe('SPAN');
    //     calls++;
    //   });
    // });

    // // Batched update, type change
    // React.unstable_batchedUpdates(function() {
    //   React.render(<article />, container, function() {
    //     expect(this.nodeName).toBe('ARTICLE');
    //     calls++;
    //   });
    // });

    expect(calls).toBe(3);
  });

  it('initial mount is sync inside batchedUpdates, but task work is deferred until the end of the batch', () => {
    var container1 = document.createElement('div');
    var container2 = document.createElement('div');

    class Foo extends React.Component {
      state = {active: false};
      componentDidMount() {
        this.setState({active: true});
      }
      render() {
        return (
          <div>{this.props.children + (this.state.active ? '!' : '')}</div>
        );
      }
    }

    React.render(<div>1</div>, container1);

    //@todo batchedUpdate
    // React.unstable_batchedUpdates(() => {
    //   // Update. Does not flush yet.
    //   React.render(<div>2</div>, container1);
    //   expect(container1.textContent).toEqual('1');

    //   // Initial mount on another root. Should flush immediately.
    //   React.render(<Foo>a</Foo>, container2);
    //   // The update did not flush yet.
    //   expect(container1.textContent).toEqual('1');
    //   // The initial mount flushed, but not the update scheduled in cDU.
    //   expect(container2.textContent).toEqual('a');
    // });
    // All updates have flushed.
    // expect(container1.textContent).toEqual('2');
    // expect(container2.textContent).toEqual('a!');
  });

  describe('mount point is a comment node', () => {
    //@todo 
    let containerDiv;
    let mountPoint;

    beforeEach(() => {
      containerDiv = document.createElement('div');
      containerDiv.innerHTML = 'A<!-- react-mount-point-unstable -->B';
      mountPoint = containerDiv.childNodes[1];
      if(mountPoint.nodeType === HTMLNodeType.COMMENT_NODE){
        throw new Error('Expected comment')
      }
      // invariant(mountPoint.nodeType === COMMENT_NODE, 'Expected comment');
    });

    // it('renders at a comment node', () => {
    //   function Char(props) {
    //     return props.children;
    //   }
    //   function list(chars) {
    //     return chars.split('').map(c => <Char key={c}>{c}</Char>);
    //   }

    //   React.render(list('aeiou'), mountPoint);
    //   expect(containerDiv.innerHTML).toBe(
    //     'Aaeiou<!-- react-mount-point-unstable -->B',
    //   );

    //   React.render(list('yea'), mountPoint);
    //   expect(containerDiv.innerHTML).toBe(
    //     'Ayea<!-- react-mount-point-unstable -->B',
    //   );

    //   React.render(list(''), mountPoint);
    //   expect(containerDiv.innerHTML).toBe(
    //     'A<!-- react-mount-point-unstable -->B',
    //   );
    // });
  });
});
