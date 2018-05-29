import React from "../../src/React";
import PropTypes from '../../node_modules/prop-types'
import {renderIntoDocument,Simulate,shallowCompare} from '../utils'
import {HTMLNodeType} from '../../src/constant'
import { CurrentOwner } from "../../src/top";
let MorphingComponent,ChildUpdates;

describe('ReactCompositeComponent', () => {
  beforeEach(() => {
  
    jasmine.clock().install();
  

    MorphingComponent = class extends React.Component {
      state = {activated: false};

      _toggleActivatedState = (e) => {
        this.setState({activated: !this.state.activated});
      };

      render() {
        var toggleActivatedState = this._toggleActivatedState;
        return !this.state.activated
          ? <a ref="x" onClick={toggleActivatedState} />
          : <b ref="x" onClick={toggleActivatedState} />;
      }
    };

    /**
     * We'll use this to ensure that an old version is not cached when it is
     * reallocated again.
     */
    ChildUpdates = class extends React.Component {
      getAnchor = () => {
        return this.refs.anch;
      };

      render() {
        var className = this.props.anchorClassOn ? 'anchorClass' : '';
        return this.props.renderAnchor
          ? <a ref="anch" className={className} />
          : <b />;
      }
    };
  });
  afterEach(()=>{
    jasmine.clock().uninstall();
  })

  it('should support rendering to different child types over time', () => {
    var instance =renderIntoDocument(<MorphingComponent />);
    var el = React.findDOMNode(instance);
    expect(el.tagName).toBe('A');
 
    instance._toggleActivatedState();
    jasmine.clock().tick(10);   
    el = React.findDOMNode(instance);
    expect(el.tagName).toBe('B');

    instance._toggleActivatedState();
    jasmine.clock().tick(10);   
    el = React.findDOMNode(instance);
    expect(el.tagName).toBe('A');

  });

  // it('should not thrash a server rendered layout with client side one', () => {
  //   class Child extends React.Component {
  //     render() {
  //       return null;
  //     }
  //   }

  //   class Parent extends React.Component {
  //     render() {
  //       return <div><Child /></div>;
  //     }
  //   }

  //   spyOn(console, 'warn');
  //   var markup = ReactDOMServer.renderToString(<Parent />);

  //   // Old API based on heuristic
  //   var container = document.createElement('div');
  //   container.innerHTML = markup;
  //   React.render(<Parent />, container);
  //   expectDev(console.warn.calls.count()).toBe(1);
  //   expectDev(console.warn.calls.argsFor(0)[0]).toContain(
  //     'render(): Calling React.render() to hydrate server-rendered markup ' +
  //       'will stop working in React v17. Replace the React.render() call ' +
  //       'with React.hydrate() if you want React to attach to the server HTML.',
  //   );

  //   // New explicit API
  //   console.warn.calls.reset();
  //   container = document.createElement('div');
  //   container.innerHTML = markup;
  //   React.hydrate(<Parent />, container);
  //   expectDev(console.warn.calls.count()).toBe(0);
  // });

  it('should react to state changes from callbacks', () => {
    var instance =renderIntoDocument(<MorphingComponent />);
    var el = React.findDOMNode(instance);
    expect(el.tagName).toBe('A');

    Simulate(el).click();
    jasmine.clock().tick(10);   
    el = React.findDOMNode(instance);
    expect(el.tagName).toBe('B');
  });

  it('should rewire refs when rendering to different child types', () => {
    var instance =renderIntoDocument(<MorphingComponent />);
    expect(React.findDOMNode(instance.refs.x).tagName).toBe('A');
    instance._toggleActivatedState();
    jasmine.clock().tick(10);   
    expect(React.findDOMNode(instance.refs.x).tagName).toBe('B');
    instance._toggleActivatedState();
    jasmine.clock().tick(10);   
    expect(React.findDOMNode(instance.refs.x).tagName).toBe('A');
  });

  it('should not cache old DOM nodes when switching constructors', () => {
    var container = document.createElement('div');
    var instance = React.render(
      <ChildUpdates renderAnchor={true} anchorClassOn={false} />,
      container,
    );
    React.render(
      // Warm any cache
      <ChildUpdates renderAnchor={true} anchorClassOn={true} />,
      container,
    );
    React.render(
      // Clear out the anchor
      <ChildUpdates renderAnchor={false} anchorClassOn={true} />,
      container,
    );
    React.render(
      // rerender
      <ChildUpdates renderAnchor={true} anchorClassOn={false} />,
      container,
    );
    expect(instance.getAnchor().className).toBe('');
  });

  it('should use default values for undefined props', () => {
    class Component extends React.Component {
      static defaultProps = {prop: 'testKey'};

      render() {
        return <span />;
      }
    }

    var instance1 =renderIntoDocument(<Component />);
    expect(instance1.props).toEqual({prop: 'testKey'});

    var instance2 =renderIntoDocument(
      <Component prop={undefined} />,
    );
    //@todo expect(instance2.props).toEqual({prop: 'testKey'});
    expect(instance2.props).toEqual({prop: undefined});

    var instance3 =renderIntoDocument(
      <Component prop={null} />,
    );
    expect(instance3.props).toEqual({prop: null});
  });

  it('should not mutate passed-in props object', () => {
    class Component extends React.Component {
      static defaultProps = {prop: 'testKey'};

      render() {
        return <span />;
      }
    }

    var inputProps = {};
    var instance1 = <Component {...inputProps} />;
    instance1 =renderIntoDocument(instance1);
    expect(instance1.props.prop).toBe('testKey');

    // We don't mutate the input, just in case the caller wants to do something
    // with it after using it to instantiate a component
    expect(inputProps.prop).not.toBeDefined();
  });

  // it('should warn about `forceUpdate` on unmounted components', () => {
  //   spyOn(console, 'error');

  //   var container = document.createElement('div');
  //   document.body.appendChild(container);

  //   class Component extends React.Component {
  //     render() {
  //       return <div />;
  //     }
  //   }

  //   var instance = <Component />;
  //   expect(instance.forceUpdate).not.toBeDefined();

  //   instance = React.render(instance, container);
  //   instance.forceUpdate();

  //   expectDev(console.error.calls.count()).toBe(0);

  //   React.unmountComponentAtNode(container);

  //   instance.forceUpdate();
  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //     'Can only update a mounted or mounting component. This usually means ' +
  //       'you called setState, replaceState, or forceUpdate on an unmounted ' +
  //       'component. This is a no-op.\n\nPlease check the code for the ' +
  //       'Component component.',
  //   );
  // });

  it('should warn about `setState` on unmounted components', () => {
    spyOn(console, 'error');

    var container = document.createElement('div');
    document.body.appendChild(container);

    var renders = 0;

    class Component extends React.Component {
      state = {value: 0};

      render() {
        renders++;
        return <div />;
      }
    }

    var instance = <Component />;
    expect(instance.setState).not.toBeDefined();

    instance = React.render(instance, container);

    expect(renders).toBe(1);

    instance.setState({value: 1});

    // expectDev(console.error.calls.count()).toBe(0);
    jasmine.clock().tick(10)
    expect(renders).toBe(2);

    React.unmountComponentAtNode(container);
    instance.setState({value: 2});

    expect(renders).toBe(2);

    // expectDev(console.error.calls.count()).toBe(1);
    // expectDev(console.error.calls.argsFor(0)[0]).toContain(
    //   'Can only update a mounted or mounting component. This usually means ' +
    //     'you called setState, replaceState, or forceUpdate on an unmounted ' +
    //     'component. This is a no-op.\n\nPlease check the code for the ' +
    //     'Component component.',
    // );
  });

  it('should silently allow `setState`, not call cb on unmounting components', () => {
    var cbCalled = false;
    var container = document.createElement('div');
    document.body.appendChild(container);

    class Component extends React.Component {
      state = {value: 0};

      componentWillUnmount() {
        expect(() => {
          this.setState({value: 2}, function() {
            cbCalled = true;
          });
        }).not.toThrow();
      }

      render() {
        return <div />;
      }
    }

    var instance = React.render(<Component />, container);
    instance.setState({value: 1});

    React.unmountComponentAtNode(container);
    expect(cbCalled).toBe(false);
  });

  // it('should warn about `setState` in render', () => {
  //   spyOn(console, 'error');

  //   var container = document.createElement('div');

  //   var renderedState = -1;
  //   var renderPasses = 0;

  //   class Component extends React.Component {
  //     state = {value: 0};

  //     render() {
  //       renderPasses++;
  //       renderedState = this.state.value;
  //       if (this.state.value === 0) {
  //         this.setState({value: 1});
  //       }
  //       return <div />;
  //     }
  //   }

  //   expectDev(console.error.calls.count()).toBe(0);

  //   var instance = React.render(<Component />, container);

  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //     'Cannot update during an existing state transition (such as within ' +
  //       "`render` or another component's constructor). Render methods should " +
  //       'be a pure function of props and state; constructor side-effects are ' +
  //       'an anti-pattern, but can be moved to `componentWillMount`.',
  //   );

  //   // The setState call is queued and then executed as a second pass. This
  //   // behavior is undefined though so we're free to change it to suit the
  //   // implementation details.
  //   expect(renderPasses).toBe(2);
  //   expect(renderedState).toBe(1);
  //   expect(instance.state.value).toBe(1);

  //   // Forcing a rerender anywhere will cause the update to happen.
  //   var instance2 = React.render(<Component prop={123} />, container);
  //   expect(instance).toBe(instance2);
  //   expect(renderedState).toBe(1);
  //   expect(instance2.state.value).toBe(1);
  // });

  // it('should warn about `setState` in getChildContext', () => {
  //   spyOn(console, 'error');

  //   var container = document.createElement('div');

  //   var renderPasses = 0;

  //   class Component extends React.Component {
  //     state = {value: 0};

  //     getChildContext() {
  //       if (this.state.value === 0) {
  //         this.setState({value: 1});
  //       }
  //     }

  //     render() {
  //       renderPasses++;
  //       return <div />;
  //     }
  //   }
  //   Component.childContextTypes = {};

  //   expectDev(console.error.calls.count()).toBe(0);
  //   var instance = React.render(<Component />, container);
  //   expect(renderPasses).toBe(2);
  //   expect(instance.state.value).toBe(1);
  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toBe(
  //     'Warning: setState(...): Cannot call setState() inside getChildContext()',
  //   );
  // });

  it('should cleanup even if render() fatals', () => {
    class BadComponent extends React.Component {
      render() {
        throw new Error();
      }
    }

    var instance = <BadComponent />;

    expect(CurrentOwner.current).toBe(null);

    expect(function() {
      instance =renderIntoDocument(instance);
    }).toThrow();

    expect(CurrentOwner.current).toBe(null);
  });

  it('should call componentWillUnmount before unmounting', () => {
    var container = document.createElement('div');
    var innerUnmounted = false;

    class Component extends React.Component {
      render() {
        return (
          <div>
            <Inner />
            Text
          </div>
        );
      }
    }

    class Inner extends React.Component {
      componentWillUnmount() {
        innerUnmounted = true;
      }

      render() {
        return <div />;
      }
    }

    React.render(<Component />, container);
    React.unmountComponentAtNode(container);
    expect(innerUnmounted).toBe(true);
  });

  // it('should warn when shouldComponentUpdate() returns undefined', () => {
  //   spyOn(console, 'error');

  //   class Component extends React.Component {
  //     state = {bogus: false};

  //     shouldComponentUpdate() {
  //       return undefined;
  //     }

  //     render() {
  //       return <div />;
  //     }
  //   }

  //   var instance =renderIntoDocument(<Component />);
  //   instance.setState({bogus: true});

  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toBe(
  //     'Warning: Component.shouldComponentUpdate(): Returned undefined instead of a ' +
  //       'boolean value. Make sure to return true or false.',
  //   );
  // });

  // it('should warn when componentDidUnmount method is defined', () => {
  //   spyOn(console, 'error');

  //   class Component extends React.Component {
  //     componentDidUnmount = () => {};

  //     render() {
  //       return <div />;
  //     }
  //   }

  //  renderIntoDocument(<Component />);

  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toBe(
  //     'Warning: Component has a method called ' +
  //       'componentDidUnmount(). But there is no such lifecycle method. ' +
  //       'Did you mean componentWillUnmount()?',
  //   );
  // });

  // it('should warn when defaultProps was defined as an instance property', () => {
  //   spyOn(console, 'error');

  //   class Component extends React.Component {
  //     constructor(props) {
  //       super(props);
  //       this.defaultProps = {name: 'Abhay'};
  //     }

  //     render() {
  //       return <div />;
  //     }
  //   }

  //  renderIntoDocument(<Component />);

  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toBe(
  //     'Warning: Setting defaultProps as an instance property on Component is not supported ' +
  //       'and will be ignored. Instead, define defaultProps as a static property on Component.',
  //   );
  // });

  it('should pass context to children when not owner', () => {
    class Parent extends React.Component {
      render() {
        return <Child><Grandchild /></Child>;
      }
    }

    class Child extends React.Component {
      static childContextTypes = {
        foo: PropTypes.string,
      };

      getChildContext() {
        return {
          foo: 'bar',
        };
      }

      render() {
        return this.props.children;
      }
    }

    class Grandchild extends React.Component {
      static contextTypes = {
        foo: PropTypes.string,
      };

      render() {
        return <div>{this.context.foo}</div>;
      }
    }

    var component =renderIntoDocument(<Parent />);
    //@todo expect(React.findDOMNode(component).innerHTML).toBe('bar');
  });

  //@todo why？
  // it('should skip update when rerendering element in container', () => {
  //   class Parent extends React.Component {
  //     render() {
  //       return <div>{this.props.children}</div>;
  //     }
  //   }

  //   var childRenders = 0;

  //   class Child extends React.Component {
  //     render() {
  //       childRenders++;
  //       return <div />;
  //     }
  //   }

  //   var container = document.createElement('div');
  //   var child = <Child />;

  //   React.render(<Parent>{child}</Parent>, container);
  //   React.render(<Parent>{child}</Parent>, container);
  //   expect(childRenders).toBe(1);
  // });

  it('should pass context when re-rendered for static child', () => {
    var parentInstance = null;
    var childInstance = null;

    class Parent extends React.Component {
      static childContextTypes = {
        foo: PropTypes.string,
        flag: PropTypes.bool,
      };

      state = {
        flag: false,
      };

      getChildContext() {
        return {
          foo: 'bar',
          flag: this.state.flag,
        };
      }

      render() {
        return this.props.children;
      }
    }

    class Middle extends React.Component {
      render() {
        return this.props.children;
      }
    }

    class Child extends React.Component {
      static contextTypes = {
        foo: PropTypes.string,
        flag: PropTypes.bool,
      };

      render() {
        childInstance = this;
        return <span>Child</span>;
      }
    }

    parentInstance =renderIntoDocument(
      <Parent><Middle><Child /></Middle></Parent>,
    );

    expect(parentInstance.state.flag).toBe(false);
    expect(childInstance.context).toEqual({foo: 'bar', flag: false});

    parentInstance.setState({flag: true});
    jasmine.clock().tick(10)
    expect(parentInstance.state.flag).toBe(true);
    expect(childInstance.context).toEqual({foo: 'bar', flag: true});
  });

  it('should pass context when re-rendered for static child within a composite component', () => {
    class Parent extends React.Component {
      static childContextTypes = {
        flag: PropTypes.bool,
      };

      state = {
        flag: true,
      };

      getChildContext() {
        return {
          flag: this.state.flag,
        };
      }

      render() {
        return <div>{this.props.children}</div>;
      }
    }

    class Child extends React.Component {
      static contextTypes = {
        flag: PropTypes.bool,
      };

      render() {
        return <div />;
      }
    }

    class Wrapper extends React.Component {
      render() {
        return (
          <Parent ref="parent">
            <Child ref="child" />
          </Parent>
        );
      }
    }

    var wrapper =renderIntoDocument(<Wrapper />);

    expect(wrapper.refs.parent.state.flag).toEqual(true);
    expect(wrapper.refs.child.context).toEqual({flag: true});

    // // We update <Parent /> while <Child /> is still a static prop relative to this update
    wrapper.refs.parent.setState({flag: false});
    jasmine.clock().tick(10);
    expect(wrapper.refs.parent.state.flag).toEqual(false);
    expect(wrapper.refs.child.context).toEqual({flag: false});
  });

  it('should pass context transitively', () => {
    var childInstance = null;
    var grandchildInstance = null;

    class Parent extends React.Component {
      static childContextTypes = {
        foo: PropTypes.string,
        depth: PropTypes.number,
      };

      getChildContext() {
        return {
          foo: 'bar',
          depth: 0,
        };
      }

      render() {
        return <Child />;
      }
    }

    class Child extends React.Component {
      static contextTypes = {
        foo: PropTypes.string,
        depth: PropTypes.number,
      };

      static childContextTypes = {
        depth: PropTypes.number,
      };

      getChildContext() {
        return {
          depth: this.context.depth + 1,
        };
      }

      render() {
        childInstance = this;
        return <Grandchild />;
      }
    }

    class Grandchild extends React.Component {
      static contextTypes = {
        foo: PropTypes.string,
        depth: PropTypes.number,
      };

      render() {
        grandchildInstance = this;
        return <div />;
      }
    }

   renderIntoDocument(<Parent />);
    expect(childInstance.context).toEqual({foo: 'bar', depth: 0});
    expect(grandchildInstance.context).toEqual({foo: 'bar', depth: 1});
  });

  it('should pass context when re-rendered', () => {
    var parentInstance = null;
    var childInstance = null;

    class Parent extends React.Component {
      static childContextTypes = {
        foo: PropTypes.string,
        depth: PropTypes.number,
      };

      state = {
        flag: false,
      };

      getChildContext() {
        return {
          foo: 'bar',
          depth: 0,
        };
      }

      render() {
        var output = <Child />;
        if (!this.state.flag) {
          output = <span>Child</span>;
        }
        return output;
      }
    }

    class Child extends React.Component {
      static contextTypes = {
        foo: PropTypes.string,
        depth: PropTypes.number,
      };

      render() {
        childInstance = this;
        return <span>Child</span>;
      }
    }

    parentInstance =renderIntoDocument(<Parent />);
    expect(childInstance).toBeNull();

    expect(parentInstance.state.flag).toBe(false);
    parentInstance.setState({flag: true});
    jasmine.clock().tick(10)
    expect(parentInstance.state.flag).toBe(true);
    expect(childInstance.context).toEqual({foo: 'bar', depth: 0});
  });

  it('unmasked context propagates through updates', () => {
    class Leaf extends React.Component {
      static contextTypes = {
        foo: PropTypes.string.isRequired,
      };

      componentWillReceiveProps(nextProps, nextContext) {
        expect('foo' in nextContext).toBe(true);
      }

      shouldComponentUpdate(nextProps, nextState, nextContext) {
        expect('foo' in nextContext).toBe(true);
        return true;
      }

      render() {
        return <span>{this.context.foo}</span>;
      }
    }

    class Intermediary extends React.Component {
      componentWillReceiveProps(nextProps, nextContext) {
        expect('foo' in nextContext).toBe(false);
      }

      shouldComponentUpdate(nextProps, nextState, nextContext) {
        expect('foo' in nextContext).toBe(false);
        return true;
      }

      render() {
        return <Leaf />;
      }
    }

    class Parent extends React.Component {
      static childContextTypes = {
        foo: PropTypes.string,
      };

      getChildContext() {
        return {
          foo: this.props.cntxt,
        };
      }

      render() {
        return <Intermediary />;
      }
    }

    var div = document.createElement('div');
    React.render(<Parent cntxt="noise" />, div);
    expect(div.children[0].innerHTML).toBe('noise');
    div.children[0].innerHTML = 'aliens';
    div.children[0].id = 'aliens';
    expect(div.children[0].innerHTML).toBe('aliens');
    expect(div.children[0].id).toBe('aliens');
    React.render(<Parent cntxt="bar" />, div);
    expect(div.children[0].innerHTML).toBe('bar');
    expect(div.children[0].id).toBe('aliens');
  });

  it('should trigger componentWillReceiveProps for context changes', () => {
    var contextChanges = 0;
    var propChanges = 0;

    class GrandChild extends React.Component {
      static contextTypes = {
        foo: PropTypes.string.isRequired,
      };

      componentWillReceiveProps(nextProps, nextContext) {
        expect('foo' in nextContext).toBe(true);

        if (nextProps !== this.props) {
          propChanges++;
        }

        if (nextContext !== this.context) {
          contextChanges++;
        }
      }

      render() {
        return <span className="grand-child">{this.props.children}</span>;
      }
    }

    class ChildWithContext extends React.Component {
      static contextTypes = {
        foo: PropTypes.string.isRequired,
      };

      componentWillReceiveProps(nextProps, nextContext) {
        expect('foo' in nextContext).toBe(true);

        if (nextProps !== this.props) {
          propChanges++;
        }

        if (nextContext !== this.context) {
          contextChanges++;
        }
      }

      render() {
        return <div className="child-with">{this.props.children}</div>;
      }
    }

    class ChildWithoutContext extends React.Component {
      componentWillReceiveProps(nextProps, nextContext) {
        expect('foo' in nextContext).toBe(false);
        if (nextProps !== this.props) {
          propChanges++;
        }

        if (nextContext !== this.context) {``
          contextChanges++;
        }
      }

      render() {
        return <div className="child-without">{this.props.children}</div>;
      }
    }

    class Parent extends React.Component {
      static childContextTypes = {
        foo: PropTypes.string,
      };

      state = {
        foo: 'abc',
      };

      getChildContext() {
        return {
          foo: this.state.foo,
        };
      }

      render() {
        return <div className="parent">{this.props.children}</div>;
      }
    }

    var div = document.createElement('div');

    var parentInstance = null;
    React.render(
      <Parent ref={inst => (parentInstance = inst)}>
        <ChildWithoutContext>
          A1
          <GrandChild>A2</GrandChild>
        </ChildWithoutContext>

        <ChildWithContext>
          B1
          <GrandChild>B2</GrandChild>
        </ChildWithContext>
      </Parent>,
      div,
    );
    
    parentInstance.setState({
      foo: 'def',
    });
    jasmine.clock().tick(10)
    expect(propChanges).toBe(0);
    expect(contextChanges).toBe(3); // ChildWithContext, GrandChild x 2
  });

  // it('should disallow nested render calls', () => {
  //   spyOn(console, 'error');

  //   class Inner extends React.Component {
  //     render() {
  //       return <div />;
  //     }
  //   }

  //   class Outer extends React.Component {
  //     render() {
  //      renderIntoDocument(<Inner />);
  //       return <div />;
  //     }
  //   }

  //  renderIntoDocument(<Outer />);
  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toMatch(
  //     'Render methods should be a pure function of props and state; ' +
  //       'triggering nested component updates from render is not allowed. If ' +
  //       'necessary, trigger nested updates in componentDidUpdate.\n\nCheck the ' +
  //       'render method of Outer.',
  //   );
  // });

  it('only renders once if updated in componentWillReceiveProps', () => {
    var renders = 0;

    class Component extends React.Component {
      state = {updated: false};

      componentWillReceiveProps(props) {
        expect(props.update).toBe(1);
        expect(renders).toBe(1);
        this.setState({updated: true});
        expect(renders).toBe(1);
      }

      render() {
        renders++;
        return <div />;
      }
    }

    var container = document.createElement('div');
    var instance = React.render(<Component update={0} />, container);
    expect(renders).toBe(1);
    expect(instance.state.updated).toBe(false);
    React.render(<Component update={1} />, container);
    expect(renders).toBe(2);
    expect(instance.state.updated).toBe(true);
  });

  // it('only renders once if updated in componentWillReceiveProps when batching', () => {
  //   var renders = 0;

  //   class Component extends React.Component {
  //     state = {updated: false};

  //     componentWillReceiveProps(props) {
  //       expect(props.update).toBe(1);
  //       expect(renders).toBe(1);
  //       this.setState({updated: true});
  //       expect(renders).toBe(1);
  //     }

  //     render() {
  //       renders++;
  //       return <div />;
  //     }
  //   }

  //   var container = document.createElement('div');
  //   var instance = React.render(<Component update={0} />, container);
  //   expect(renders).toBe(1);
  //   expect(instance.state.updated).toBe(false);
  //   React.unstable_batchedUpdates(() => {
  //     React.render(<Component update={1} />, container);
  //   });
  //   expect(renders).toBe(2);
  //   expect(instance.state.updated).toBe(true);
  // });

  it('should update refs if shouldComponentUpdate gives false', () => {
    class Static extends React.Component {
      shouldComponentUpdate() {
        return false;
      }

      render() {
        return <div>{this.props.children}</div>;
      }
    }

    class Component extends React.Component {
      render() {
        if (this.props.flipped) {
          return (
            <div>
              <Static ref="static0" key="B">B (ignored)</Static>
              <Static ref="static1" key="A">A (ignored)</Static>
            </div>
          );
        } else {
          return (
            <div>
              <Static ref="static0" key="A">A</Static>
              <Static ref="static1" key="B">B</Static>
            </div>
          );
        }
      }
    }

    var container = document.createElement('div');
    var comp = React.render(<Component flipped={false} />, container);
    expect(React.findDOMNode(comp.refs.static0).textContent).toBe('A');
    expect(React.findDOMNode(comp.refs.static1).textContent).toBe('B');

    // When flipping the order, the refs should update even though the actual
    // contents do not
    React.render(<Component flipped={true} />, container);
    
    expect(React.findDOMNode(comp.refs.static0).textContent).toBe('B');
    expect(React.findDOMNode(comp.refs.static1).textContent).toBe('A');
  });

  it('should allow access to findDOMNode in componentWillUnmount', () => {
    var a = null;
    var b = null;

    class Component extends React.Component {
      componentDidMount() {
        a = React.findDOMNode(this);
        expect(a).not.toBe(null);
      }

      componentWillUnmount() {
        b = React.findDOMNode(this);
        expect(b).not.toBe(null);
      }

      render() {
        return <div />;
      }
    }

    var container = document.createElement('div');
    expect(a).toBe(container.firstChild);
    React.render(<Component />, container);
    React.unmountComponentAtNode(container);
    expect(a).toBe(b);
  });

  it('context should be passed down from the parent', () => {
    class Parent extends React.Component {
      static childContextTypes = {
        foo: PropTypes.string,
      };

      getChildContext() {
        return {
          foo: 'bar',
        };
      }

      render() {
        return <div>{this.props.children}</div>;
      }
    }

    class Component extends React.Component {
      static contextTypes = {
        foo: PropTypes.string.isRequired,
      };

      render() {
        return <div />;
      }
    }

    var div = document.createElement('div');
    React.render(<Parent><Component /></Parent>, div);
  });

  // it('should replace state', () => {
    //@not support updater
  //   class Moo extends React.Component {
  //     state = {x: 1};
  //     render() {
  //       return <div />;
  //     }
  //   }

  //   var moo =renderIntoDocument(<Moo />);
  //   // No longer a public API, but we can test that it works internally by
  //   // reaching into the updater.
  //   moo.updater.enqueueReplaceState(moo, {y: 2});
  //   expect('x' in moo.state).toBe(false);
  //   expect(moo.state.y).toBe(2);
  // });

  // it('should support objects with prototypes as state', () => {
      //@not support updater
  //   var NotActuallyImmutable = function(str) {
  //     this.str = str;
  //   };
  //   NotActuallyImmutable.prototype.amIImmutable = function() {
  //     return true;
  //   };
  //   class Moo extends React.Component {
  //     state = new NotActuallyImmutable('first');
  //     // No longer a public API, but we can test that it works internally by
  //     // reaching into the updater.
  //     _replaceState = update => this.updater.enqueueReplaceState(this, update);
  //     render() {
  //       return <div />;
  //     }
  //   }

  //   var moo =renderIntoDocument(<Moo />);
  //   expect(moo.state.str).toBe('first');
  //   expect(moo.state.amIImmutable()).toBe(true);

  //   var secondState = new NotActuallyImmutable('second');
  //   moo._replaceState(secondState);
  //   expect(moo.state.str).toBe('second');
  //   expect(moo.state.amIImmutable()).toBe(true);
  //   expect(moo.state).toBe(secondState);

  //   moo.setState({str: 'third'});
  //   expect(moo.state.str).toBe('third');
  //   // Here we lose the prototype.
  //   expect(moo.state.amIImmutable).toBe(undefined);

  //   // When more than one state update is enqueued, we have the same behavior
  //   var fifthState = new NotActuallyImmutable('fifth');
  //   React.unstable_batchedUpdates(function() {
  //     moo.setState({str: 'fourth'});
  //     moo._replaceState(fifthState);
  //   });
  //   expect(moo.state).toBe(fifthState);

  //   // When more than one state update is enqueued, we have the same behavior
  //   var sixthState = new NotActuallyImmutable('sixth');
  //   React.unstable_batchedUpdates(function() {
  //     moo._replaceState(sixthState);
  //     moo.setState({str: 'seventh'});
  //   });
  //   expect(moo.state.str).toBe('seventh');
  //   expect(moo.state.amIImmutable).toBe(undefined);
  // });

  it('should not warn about unmounting during unmounting', () => {
    var container = document.createElement('div');
    var layer = document.createElement('div');

    class Component extends React.Component {
      componentDidMount() {
        React.render(<div />, layer);
      }

      componentWillUnmount() {
        React.unmountComponentAtNode(layer);
      }

      render() {
        return <div />;
      }
    }

    class Outer extends React.Component {
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    React.render(<Outer><Component /></Outer>, container);
    React.render(<Outer />, container);
  });

  // it('should warn when mutated props are passed', () => {
  //   spyOn(console, 'error');

  //   var container = document.createElement('div');

  //   class Foo extends React.Component {
  //     constructor(props) {
  //       var _props = {idx: props.idx + '!'};
  //       super(_props);
  //     }

  //     render() {
  //       return <span />;
  //     }
  //   }

  //   expectDev(console.error.calls.count()).toBe(0);

  //   React.render(<Foo idx="qwe" />, container);

  //   expectDev(console.error.calls.count()).toBe(1);
  //   expectDev(console.error.calls.argsFor(0)[0]).toContain(
  //     'Foo(...): When calling super() in `Foo`, make sure to pass ' +
  //       "up the same props that your component's constructor was passed.",
  //   );
  // });

  it('should only call componentWillUnmount once', () => {
    var app;
    var count = 0;

    class App extends React.Component {
      render() {
        if (this.props.stage === 1) {
          return <UnunmountableComponent />;
        } else {
          return null;
        }
      }
    }

    class UnunmountableComponent extends React.Component {
      componentWillUnmount() {
        // app.setState({});
        count++;
        throw Error('always fails');
      }

      render() {
        return <div>Hello {this.props.name}</div>;
      }
    }

    var container = document.createElement('div');

    var setRef = ref => {
      if (ref) {
        app = ref;
      }
    };

    expect(function() {
      React.render(<App ref={setRef} stage={1} />, container);
      React.render(<App ref={setRef} stage={2} />, container);
    }).toThrow();
    expect(count).toBe(1);
  });

  it('prepares new child before unmounting old', () => {
    var log = [];

    class Spy extends React.Component {
      componentWillMount() {
        log.push(this.props.name + ' componentWillMount');
      }
      render() {
        log.push(this.props.name + ' render');
        return <div />;
      }
      componentDidMount() {
        log.push(this.props.name + ' componentDidMount');
      }
      componentWillUnmount() {
        log.push(this.props.name + ' componentWillUnmount');
      }
    }

    class Wrapper extends React.Component {
      render() {
        return <Spy key={this.props.name} name={this.props.name} />;
      }
    }

    var container = document.createElement('div');
    React.render(<Wrapper name="A" />, container);
    React.render(<Wrapper name="B" />, container);
    expect(log).toEqual([
      'A componentWillMount',
      'A render',
      'A componentDidMount',

      'B componentWillMount',
      'B render',
      'A componentWillUnmount',
      'B componentDidMount',
    ]);
  });

  it('respects a shallow shouldComponentUpdate implementation', () => {
    var renderCalls = 0;
    
    class PlasticWrap extends React.Component {
      constructor(props, context) {
        super(props, context);
        this.state = {
          color: 'green',
        };
      }

      render() {
        return <Apple color={this.state.color} ref="apple" />;
      }
    }

    class Apple extends React.Component {
      state = {
        cut: false,
        slices: 1,
      };

      shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }

      cut() {
        this.setState({
          cut: true,
          slices: 10,
        });
      }

      eatSlice() {
        this.setState({
          slices: this.state.slices - 1,
        });
      }

      render() {
        renderCalls++;
        return <div />;
      }
    }

    var container = document.createElement('div');
    var instance = React.render(<PlasticWrap />, container);
    expect(renderCalls).toBe(1);

    // Do not re-render based on props
    instance.setState({color: 'green'});
    jasmine.clock().tick(10)
    expect(renderCalls).toBe(1);

    // Re-render based on props
    instance.setState({color: 'red'});
    jasmine.clock().tick(10)
    
    expect(renderCalls).toBe(2);

    // // Re-render base on state
    instance.refs.apple.cut();
    jasmine.clock().tick(10)
    
    expect(renderCalls).toBe(3);

    // No re-render based on state
    instance.refs.apple.cut();
    jasmine.clock().tick(10)
    
    expect(renderCalls).toBe(3);

    // Re-render based on state again
    instance.refs.apple.eatSlice();
    jasmine.clock().tick(10)
    
    expect(renderCalls).toBe(4);
  });

  it('does not do a deep comparison for a shallow shouldComponentUpdate implementation', () => {
    function getInitialState() {
      return {
        foo: [1, 2, 3],
        bar: {a: 4, b: 5, c: 6},
      };
    }

    var renderCalls = 0;
    var initialSettings = getInitialState();

    class Component extends React.Component {
      state = initialSettings;

      shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }

      render() {
        renderCalls++;
        return <div />;
      }
    }

    var container = document.createElement('div');
    var instance = React.render(<Component />, container);
    expect(renderCalls).toBe(1);

    // Do not re-render if state is equal
    var settings = {
      foo: initialSettings.foo,
      bar: initialSettings.bar,
    };
    instance.setState(settings);
    jasmine.clock().tick(10)
    
    expect(renderCalls).toBe(1);

    // Re-render because one field changed,don't accepted
    // it is the same ref ,Do not re-render if state is equal
    initialSettings.foo = [1, 2, 3];
    instance.setState(initialSettings);
    jasmine.clock().tick(10)
    
    expect(renderCalls).toBe(1);

    // Re-render because the object changed
    instance.setState(getInitialState());
    jasmine.clock().tick(10)
    
    expect(renderCalls).toBe(2);
  });

  it('should call setState callback with no arguments', () => {
    let mockArgs;
    class Component extends React.Component {
      componentDidMount() {
        this.setState({}, (...args) => (mockArgs = args));
      }
      render() {
        return false;
      }
    }

   renderIntoDocument(<Component />);
   jasmine.clock().tick(10)
   
    expect(mockArgs.length).toEqual(0);
  });
});
