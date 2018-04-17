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

export function updateComponent(component, isForce) {
    const { vNode, props } = component;
    const previousProps = props;
    const previousState = state;
    let skip;
    if (
        component.shouldComponentUpdate &&
        isFunction(component.shouldComponentUpdate)
    ) {
        skip = component.componentShouldUpdate() && isForce;
    }
}
