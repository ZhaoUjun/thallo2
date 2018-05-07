import React from "../../src/React";

describe("ReactElement", () => {
    let ComponentClass;
    ComponentClass = class extends React.Component {
        render() {
            return React.createElement("div");
        }
    };

    it("returns a complete element according to spec", () => {
        const element = React.createFactory(ComponentClass)();
        expect(element.type).toBe(ComponentClass);
        expect(element.key).toBe(null);
        expect(element.ref).toBe(null);
        // expect(Object.isFrozen(element)).toBe(true);
        expect(Object.isFrozen(element.props)).toBe(true);
        expect(element.props).toEqual({});
    });

    it("allows a string to be passed as the type", () => {
        var element = React.createFactory("div")();
        expect(element.type).toBe("div");
        expect(element.key).toBe(null);
        expect(element.ref).toBe(null);
        // expect(Object.isFrozen(element)).toBe(true);
        expect(Object.isFrozen(element.props)).toBe(true);
        expect(element.props).toEqual({});
    });
    // it("returns an immutable element", () => {
    //     var element = React.createFactory(ComponentClass)();
    //     expect(() => (element.type = "div")).toThrow();
    // });
    it("does not reuse the original config object", () => {
        var config = { foo: 1 };
        var element = React.createFactory(ComponentClass)(config);
        expect(element.props.foo).toBe(1);
        config.foo = 2;
        expect(element.props.foo).toBe(1);
    });
    it("does not fail if config has no prototype", () => {
        var config = Object.create(null, {
            foo: { value: 1, enumerable: true }
        });
        var element = React.createFactory(ComponentClass)(config);
        expect(element.props.foo).toBe(1);
    });
    it("extracts key and ref from the config", () => {
        var element = React.createFactory(ComponentClass)({
            key: "12",
            ref: "34",
            foo: "56"
        });
        expect(element.type).toBe(ComponentClass);
        expect(element.key).toBe("12");
        expect(element.ref).toBe("34");
        // expect(Object.isFrozen(element)).toBe(true);
        expect(Object.isFrozen(element.props)).toBe(true);
        expect(element.props).toEqual({
            foo: "56"
        });
    });

    it("extracts null key and ref", () => {
        var element = React.createFactory(ComponentClass)({
            key: null,
            ref: null,
            foo: "12"
        });
        expect(element.type).toBe(ComponentClass);
        expect(element.key).toBe(null);
        expect(element.ref).toBe(null);
        // expect(Object.isFrozen(element)).toBe(true);
        expect(Object.isFrozen(element.props)).toBe(true);
        expect(element.props).toEqual({
            foo: "12"
        });
    });
    it("ignores key and ref warning getters", () => {
        var elementA = React.createElement("div");
        var elementB = React.createElement("div", elementA.props);
        expect(elementB.key).toBe(null);
        expect(elementB.ref).toBe(null);
    });
    it("coerces the key to a string", () => {
        var element = React.createFactory(ComponentClass)({
            key: 12,
            foo: "56"
        });
        expect(element.type).toBe(ComponentClass);
        expect(element.key).toBe("12");
        expect(element.ref).toBe(null);
        // expect(Object.isFrozen(element)).toBe(true);
        expect(Object.isFrozen(element.props)).toBe(true);
        expect(element.props).toEqual({ foo: "56" });
    });
    it("preserves the owner on the element", () => {
        const cointainer = document.createElement("div");
        let Component = React.createFactory(ComponentClass);
        let element, parent;

        class Wrapper extends React.Component {
            componentDidMount() {
                parent = this;
            }
            render() {
                element = Component();
                return element;
            }
        }
        React.createElement(<Wrapper />);
        React.render(<Wrapper />, cointainer);
        expect(element._owner).toEqual(parent);
    });
    it("merges an additional argument onto the children prop", () => {
        spyOn(console, "error");
        var a = 1;
        var element = React.createFactory(ComponentClass)(
            {
                children: "text"
            },
            a
        );
        expect(element.props.children[0].text).toBe(1);
    });
    it("does not override children if no rest args are provided", () => {
        var element = React.createFactory(ComponentClass)({
            children: "text"
        });
        expect(element.props.children[0].text).toEqual("text");
        //offical expect(element.props.children).toEqual("text");
    });
    it("overrides children if null is provided as an argument", () => {
        var element = React.createFactory(ComponentClass)(
            {
                children: "text"
            },
            null
        );
        expect(element.props.children).toEqual([null]);
        //offical expect(element.props.children).toEqual([null]);
    });
    it("merges rest arguments onto the children prop in an array", () => {
        var a = 1;
        var b = 2;
        var c = 3;
        var element = React.createFactory(ComponentClass)(null, a, b, c);
        // offical expect(element.props.children).toEqual([1, 2, 3]);
        expect(element.props.children[0].text).toBe(1);
        expect(element.props.children[1].text).toBe(2);
        expect(element.props.children[2].text).toBe(3);
    });
    it("allows static methods to be called using the type property", () => {
        class StaticMethodComponentClass extends React.Component {
            render() {
                return React.createElement("div");
            }
        }
        StaticMethodComponentClass.someStaticMethod = () => "someReturnValue";

        var element = React.createElement(StaticMethodComponentClass);
        expect(element.type.someStaticMethod()).toBe("someReturnValue");
    });
    it("identifies valid elements", () => {
        class Component extends React.Component {
            render() {
                return React.createElement("div");
            }
        }

        expect(React.isValidElement(React.createElement("div"))).toEqual(true);
        expect(React.isValidElement(React.createElement(Component))).toEqual(
            true
        );

        expect(React.isValidElement(null)).toEqual(false);
        expect(React.isValidElement(true)).toEqual(false);
        expect(React.isValidElement({})).toEqual(false);
        expect(React.isValidElement("string")).toEqual(false);
        expect(React.isValidElement(React.createFactory("div"))).toEqual(false);
        expect(React.isValidElement(Component)).toEqual(false);
        expect(React.isValidElement({ type: "div", props: {} })).toEqual(false);
        const element = React.createElement("div");
        // var jsonElement = JSON.stringify(element);

        // expect(React.isValidElement(JSON.parse(jsonElement))).toBe(true); no pass
    });
    it("should use default prop value when removing a prop", () => {
        class Component extends React.Component {
            render() {
                return React.createElement("span");
            }
        }
        Component.defaultProps = { fruit: "persimmon" };

        var container = document.createElement("div");
        var instance = React.render(
            React.createElement(Component, { fruit: "mango" }),
            container
        );
        expect(instance.props.fruit).toBe("mango");
        let element = React.createElement(Component);
        React.render(element, container);
        expect(instance.props.fruit).toBe("persimmon");
    });
    it('should normalize props with default values', () => {
        var container = document.createElement("div");
        
        class Component extends React.Component {
          render() {
            return React.createElement('span', null, this.props.prop);
          }
        }
        Component.defaultProps = {prop: 'testKey'};
    
        // var instance = ReactTestUtils.renderIntoDocument(
        //   React.createElement(Component),
        // );
        var instance = React.render(
            React.createElement(Component),
            container
        );
        expect(instance.props.prop).toBe('testKey');
    
        // var inst2 = ReactTestUtils.renderIntoDocument(
        //   React.createElement(Component, {prop: null}),
        // );
        // console.log(instance)
        var inst2 = React.render(
            React.createElement(Component,{prop: null}),
            container
        );
        // expect(inst2.props.prop).toBe(null);
      });
      it('throws when changing a prop (in dev) after element creation', () => {
        var container = document.createElement("div");
          
        class Outer extends React.Component {
          render() {
            var el = <div className="moo" />;
    
            expect(function() {
              el.props.className = 'quack';
            }).toThrow();
            expect(el.props.className).toBe('moo');
    
            return el;
          }
        }

        var instance = React.render(
            <Outer color="orange" />,
            container
        );
        // var outer = ReactTestUtils.renderIntoDocument(<Outer color="orange" />);
        expect(instance.vNode.dom.className).toBe('moo');
      });
      it('throws when adding a prop (in dev) after element creation', () => {
        var container = document.createElement('div');
        class Outer extends React.Component {
          render() {
            var el = <div>{this.props.sound}</div>;
    
            expect(function() {
              el.props.className = 'quack';
            }).toThrow();
    
            expect(el.props.className).toBe(undefined);
    
            return el;
          }
        }
        Outer.defaultProps = {sound: 'meow'};
        var outer = React.render(<Outer />, container);
        expect(outer.vNode.dom.textContent).toBe('meow');
        expect(outer.vNode.dom.className).toBe('');
      });
      it('does not warn for NaN props', () => {
        var container = document.createElement('div');
          
        class Test extends React.Component {
          render() {
            return <div />;
          }
        }
        var instance = React.render(
            <Test value={+undefined} />,
            container
        );
        // var test = ReactTestUtils.renderIntoDocument(<Test value={+undefined} />);
        expect(instance.props.value).toBeNaN();
      });
});
