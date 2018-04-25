import { NODE_TAG } from "../constant";
import {
    getChildrenfromProps,
    isClass,
    isComponent,
    isFunction,
    isNotNullOrUndefined,
    hasLifeCycle
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
        hasLifeCycle('shouldComponentUpdate',component)
    ) {
        shouldSkip =
            component.shouldComponentUpdate(props, state, context) && !isForce;
    }
    if (
        hasLifeCycle('getSnapshotBeforeUpdate',component)
    ) {
        snapShot = component.getSnapshotBeforeUpdate(
            preProps,
            preState,
            preContext
        );
    }
    if (!shouldSkip) {
        if (
            hasLifeCycle('componentWillUpdate',component)
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
        hasLifeCycle('componentDidUpdate',component)
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
