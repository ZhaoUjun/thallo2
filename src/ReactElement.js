import { CurrentOwner } from "./top";
import { isString, isFunction, isUndefined, isClass, isArray,isComposite } from "./utils";
import {
    NormalComponent,
    HostNode,
    TextNode,
    StateLessCompoent
} from "./vNodes";

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
    return Object.prototype.hasOwnProperty.call(props,"children")&&children.length<1
        ? isArray(props.children)
            ? props.children
            : [props.children]
        : children;
}

function mergeProps(type, props = {}, children) {
    children = mergeChildren(props, children);
    
    const newProps = children.length>0
        ? {
              children,
              owner: CurrentOwner.current
          }
        : { owner: CurrentOwner.current };
    if (isFunction(type) && type.defaultProps) {
        props = {  ...type.defaultProps,...props };
    }
    Object.keys(props).forEach(propsName => {
        if (propsName === "defaultValue") {
            newProps[value] = props.value || props.defaultVale;
        }
        if(propsName==='children'){
            return
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
