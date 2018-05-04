import { CurrentOwner } from "./top";
import {
    isNumber,
    isString,
    isFunction,
    isUndefined,
    isClass,
    isArray,
    isComposite,
    isVnode,
    isNotNullOrUndefined
} from "./utils";
import {
    NormalComponent,
    HostNode,
    TextNode,
    StateLessCompoent
} from "./vNodes";
import { REACT_ELEMENT_TYPE } from "./constant";

export function instantiateVNode(element) {
    if (typeof element === "string") {
        return new TextNode(element);
    }
    const { type } = element;
    if (typeof type === "function") {
        return isClass(type)
            ? new NormalComponent(element)
            : new StateLessCompoent(element);
    } else if (typeof type === "string") {
        return new HostNode(element);
    }
}

function mergeChildren(props, children) {
    children =
        Object.prototype.hasOwnProperty.call(props, "children") &&
        children.length < 1
            ? isArray(props.children)
                ? props.children
                : [props.children]
            : children;
    return transformChildren(children);
}

function transformChildren(children) {
    let child,
        i = children.length,
        mergedChildren = [];

    while (i > 0) {
        child = children.shift();
        if (isVnode(child)) {
            mergedChildren.push(child);
        } else if (isArray(child)) {
            mergedChildren.push(transformChildren(child));
        } else if (isString(child) || isNumber(child)) {
            mergedChildren.push(new TextNode(child));
        } else if (child === null || child === undefined) {
            mergedChildren.push(child);
        }
        i--;
    }
    return mergedChildren;
}

function mergeProps(type, props = {}, children) {
    children = mergeChildren(props, children);
    const newProps =
        children.length > 0
            ? {
                  children,
                  owner: CurrentOwner.current
              }
            : { owner: CurrentOwner.current };
    if (isFunction(type) && type.defaultProps) {
        props = { ...type.defaultProps, ...props };
    }
    Object.keys(props).forEach(propsName => {
        if (propsName === "defaultValue") {
            newProps[value] = props.value || props.defaultVale;
        }
        if (propsName === "children") {
            return;
        }
        if (isString(type)) {
            //@Todo :dispose SVG
        }
        newProps[propsName] = props[propsName];
    });

    return newProps;
}

export function createElement(type, props, ...args) {
    props = props || {};
    return instantiateVNode({ type, props: mergeProps(type, props, args) });
}

export function createFactory(type) {
    const element = createElement.bind(null, type);
    element.type = type;
    return element;
}

export function cloneElement(element, config, ...children) {
    config=config||{}
 
    if (isArray(element)) {
        element = element[0];
    }
    const { type } = element;
    const defaultProps = type && type.defaultProps;
    let props = { ...element.props, ...config };
    if (defaultProps) {
        props = { ...defaultProps, ...props };
    }
    let owner = element._owner;
    let ref;
    if (config.ref && CurrentOwner.current) {
        ref = config.ref;
        owner = CurrentOwner.current;
    }
    if (children.length > 0) {
        props.children = children;
    }
    
    const newConfig = ref
        ? { ...element, ...config, props, ref, _owner: owner }
        : { ...element, ...config, props };
    const newElement = Object.create(Object.getPrototypeOf(element));
    Object.keys(newConfig).forEach(key => {
        newElement[key] = newConfig[key];
    });
    return newElement;
}

export function isValidElement(object) {
    return (
        typeof object === "object" &&
        object !== null &&
        object.$$typeof === REACT_ELEMENT_TYPE
    );
}
