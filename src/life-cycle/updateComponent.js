import { NODE_TAG } from "../constant";
import {
    getChildrenfromProps,
    isClass,
    isComponent,
    isFunction,
    isNotNullOrUndefined
} from "../utils";
import { CurrentOwner, mountedComponents } from "../top";
import { createDomNode } from "../createDomNode";
import { getChildContext } from "../utils/getChildContext";
import Ref from "../Ref";
import diff from "../diff";

export function updateComponent(component, isForce) {
    component.state = component.getState();
    const { vNode, props, state, context } = component;
    const preProps = component.preProps || props;
    const preState = component.preState || state;
    const preContext = component.preContext || context;
    let shouldSkip = false,
        snapShot;
    if (
        component.shouldComponentUpdate &&
        isFunction(component.shouldComponentUpdate)
    ) {
        shouldSkip =
            component.shouldComponentUpdate(props, state, context) && !isForce;
    }
    if (
        component.getSnapshotBeforeUpdate &&
        isFunction(component.getSnapshotBeforeUpdate)
    ) {
        snapShot = component.getSnapshotBeforeUpdate(
            preProps,
            preState,
            preContext
        );
    }
    if (!shouldSkip) {
        if (
            component.componentWillUpdate &&
            isFunction(component.componentWillUpdate)
        ) {
            component.componentWillUpdate(props, state);
        }
        const lastRendered = vNode._rendered;
        CurrentOwner.current = component;
        const rendered = (vNode._rendered = component.render());
        CurrentOwner.current = null;
        const parentDom = lastRendered.dom && lastRendered.dom.parentNode;
        vNode.dom = diff(lastRendered, rendered, parentDom);
    }
    component.preProps = props;
    component.preState = state;
    component.preContext = context;
    component._dirty = false;
    if (
        component.componentDidUpdate &&
        isFunction(component.componentDidUpdate)
    ) {
        component.componentDidUpdate(preProps, preState, snapShot);
    }
    if (component._pendingCallbacks) {
        while (component._pendingCallbacks.length) {
            component._pendingCallbacks.pop().call(component);
        }
    }
    return vNode.dom;
}

export function reRenderComponent(preVNode, nextVNode, prarentComponent) {}
