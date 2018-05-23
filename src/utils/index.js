import { EMPTY_OBJ, NODE_TAG,REACT_ELEMENT_TYPE,HTMLNodeType } from "../constant";

export function isFunction(obj) {
    return typeof obj === "function";
}

export function isString(string) {
    return typeof string === "string";
}

export function isNumber(num) {
    return typeof num === 'number';
}

export function isIterator(obj){
    return obj!==null&&typeof obj ==='object'&&obj[Symbol.iterator]
}
export function isUndefined(obj) {
    return typeof obj === "undefined";
}

export function isClass(elementType) {
    return (
        Boolean(elementType.prototype) &&
        Boolean(elementType.prototype.isReactComponent)
    );
}

export function isObject(val) {
    return val !== null && typeof val === 'object' && Array.isArray(val) === false;
};

export function isComposite(vNode) {
    return (NODE_TAG.NORMAL_COMPONENT | NODE_TAG.STATELESS) & vNode.tag;
}

export function isStateless(vNode) {
    return vNode.tag & NODE_TAG.STATELESS;
}

export function isArray(obj) {
    return Array.isArray(obj);
}

export function isNotNullOrUndefined(obj) {
    return obj !== undefined && obj !== null;
}

export function isRef(ref) {
    return ref || (ref !== null && ref !== undefined);
}

export function getChildrenfromProps(props) {
    const children = props.children || [];
    return isArray(children) ? children : [children];
}

export function setAttribute(node, props) {
    Object.keys(props).forEach(propName => {
        if (propName === "children") {
            return;
        }
        if (propName === "className") {
            node.setAttribute("class", props[propName]);
        }
        if (propName === "style") {
        }
        node.setAttribute(propName, props[propName]);
    });
}

export function isComponent(instance) {
    return instance && instance.isReactComponent === EMPTY_OBJ;
}

export function isVnode(vNode){
     return isNotNullOrUndefined(vNode)&&vNode.$$typeof===REACT_ELEMENT_TYPE
}
export function isSameNode(a,b){
    if(a&&b){
        return a.type===b.type&&a.key===b.key
    }
    else if(!a&&!b){
        return a===b
    }
    else{
        return false
    }
}

export function defer(fun, ...args) {
    fun = isFunction(fun) ? fun.bind(null, ...args) : fun;
    setTimeout(fun,0)
    // const deferer = requestAnimationFrame || setTimeout;
}

export function hasLifeCycle(name ,component){
    return component&&component[name]&&isFunction(component[name])
}

export function objHasNullProp(propName,obj){
    return Object.prototype.hasOwnProperty.call(obj,propName)&&Object[propName]===null
}

export function isValidContainer(dom){
    if(!isNotNullOrUndefined(dom)){
        return false
    }
    if(!dom.nodeType){
        return false
    }
    return Object.keys(HTMLNodeType).some(type=>HTMLNodeType[type]===dom.nodeType)
}
