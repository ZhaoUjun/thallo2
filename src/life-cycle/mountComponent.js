import { NODE_TAG } from "../constant";
import {
    getChildrenfromProps,
    isClass,
    isComponent,
    isFunction,
    isNotNullOrUndefined
} from "../utils";
import { CurrentOwner } from "../top";
import { createDomNode } from "../createDomNode";
import { getChildContext } from "../utils/getChildContext";
import Ref from "../Ref";

export function mountComponent(vNode, parentContext, parentComponent) {
    const { tag, props, type, ref } = vNode;
    const component = (vNode.component = new type(props, parentContext));
    component.vNode = vNode;
    if (isComponent(parentComponent)) {
        component._parentComponent = parentComponent;
    }
    if (isFunction(component.componentWillMount)) {
        component.componentWillMount();
        component.state = component.getState();
    }
    let rendered;
    CurrentOwner.current = component;
    rendered = vNode._rendered = component.render();
    CurrentOwner.current = null;
    if (isFunction(component.componentDidMount)) {
        component.componentDidMount();
    }
    if (isNotNullOrUndefined(ref)) {
        Ref.attach(vNode, ref, vNode.dom);
    }
    const dom = (vNode.dom = createDomNode(
        rendered,
        getChildContext(vNode, parentContext),
        parentComponent,
        false
    ));
    component._disable = false;
    return dom;
}
