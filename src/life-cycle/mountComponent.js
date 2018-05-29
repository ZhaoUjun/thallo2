import { NODE_TAG } from "../constant";
import {
    getChildrenfromProps,
    isClass,
    isComponent,
    isFunction,
    isNotNullOrUndefined,
    hasLifeCycle,
    isArray,
    isString,
    isNumber
} from "../utils";
import { CurrentOwner } from "../top";
import { createDomNode } from "../createDomNode";
import { getChildContext } from "../utils/getChildContext";
import { createElement } from "../ReactElement";
import { TextNode } from "../vNodes";

function instanizeComponent(vNode, parentContext) {
    const { type, props } = vNode;
    const component = (vNode.component = new type(props, parentContext));
    if (props && !component.props) {
        component.props = props;
    }
    if (
        isArray(component.state) ||
        isNumber(component.state) ||
        isString(component.state)
    ) {
        throw "Foo.state: must be set to an object or null";
    }
    return component;
}

function getRendered(component) {
    let rendered = component.render();
    if (isNumber(rendered) || isString(rendered)) {
        rendered = new TextNode(rendered);
    } else if (!isNotNullOrUndefined(rendered)) {
        rendered = new TextNode("");
    }
    return rendered;
}

export function renderComponent(vNode, component) {
    if (!isFunction(component.render)) {
        console.error(
            "Warning: Foo(...): No `render` method found on the returned component " +
                "instance: you may have forgotten to define `render`."
        );
    }
    if (isFunction(component.getInitialState) && !component.state) {
        console.error(
            "getInitialState was defined on Foo, a plain JavaScript class."
        );
    }
    if (isFunction(component.getDefaultProps) && !component.state) {
        console.error(
            "getDefaultProps was defined on Foo, a plain JavaScript class."
        );
    }
    if (
        isFunction(component.componentShouldUpdate) &&
        !isFunction(component.shouldComponentUpdate)
    ) {
        console.error(
            "Warning: " +
                "NamedComponent has a method called componentShouldUpdate(). Did you " +
                "mean shouldComponentUpdate()? The name is phrased as a question " +
                "because the function is expected to return a value."
        );
    }
    if (
        isFunction(component.componentWillRecieveProps) &&
        !isFunction(component.componentWillReceiveProps)
    ) {
        console.error(
            "Warning: " +
                "NamedComponent has a method called componentWillRecieveProps(). Did " +
                "you mean componentWillReceiveProps()?"
        );
    }
    let rendered;
    CurrentOwner.current = component;
    try {
        //@todo dispose null
        rendered = vNode._rendered = getRendered(component);
    } catch (err) {
        throw err;
    } finally {
        CurrentOwner.current = null;
    }

    return rendered;
}

export function mountComponent(vNode, parentContext = {}, parentComponent) {
    let context = {};
    const { props, type, ref } = vNode;
    if (type.contextTypes) {
        Object.keys(type.contextTypes).forEach(key => {
            context[key] = parentContext[key];
        });
    }
    const component = instanizeComponent(vNode, context);
    component.childContext = getChildContext(component, parentContext);
    component.vNode = vNode;
    if (isComponent(parentComponent)) {
        component._parentComponent = parentComponent;
    }
    if (hasLifeCycle("componentWillMount", component)) {
        component.componentWillMount();
        component.state = component.getState();
    }

    const rendered = renderComponent(vNode, component);

    const dom = (vNode.dom = createDomNode(
        rendered,
        component.childContext,
        parentComponent,
        false
    ));
    component._disable = false;
    return dom;
}

export function mountStateLessComponent(vNode, parentContext, parentComponent) {
    const { props, type, ref } = vNode;
    if (ref) {
        console.error("stateless component do not support ref ");
    }
    CurrentOwner.current = null;
    const rendered = (vNode._rendered = type(props));
    const dom = (vNode.dom = createDomNode(
        rendered,
        parentContext,
        parentComponent,
        false
    ));
    return dom;
}
