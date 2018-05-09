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

function instanizeComponent(vNode,parentContext){
    const { type,props } = vNode;
    const component = (vNode.component = new type(props, parentContext));
    if(props&&!component.props){
        component.props=props
    }
    if(isArray(component.state)||isNumber(component.state)||isString(component.state)){
        throw 'Foo.state: must be set to an object or null'
    }
    return component
}

export function renderComponent(vNode,component){
    if(!isFunction(component.render)){
        console.error('Warning: Foo(...): No `render` method found on the returned component ' +
        'instance: you may have forgotten to define `render`.') 
    }
    if(isFunction(component.getInitialState)&&!component.state){
        console.error('getInitialState was defined on Foo, a plain JavaScript class.')
    }
    if(isFunction(component.getDefaultProps)&&!component.state){
        console.error('getDefaultProps was defined on Foo, a plain JavaScript class.')
    }
    if(isFunction(component.componentShouldUpdate)&&!isFunction(component.shouldComponentUpdate)){
        console.error(   'Warning: ' +
        'NamedComponent has a method called componentShouldUpdate(). Did you ' +
        'mean shouldComponentUpdate()? The name is phrased as a question ' +
        'because the function is expected to return a value.',)
    }
    if(isFunction(component.componentWillRecieveProps)&&!isFunction(component.componentWillReceiveProps)){
        console.error(   'Warning: ' +
        'NamedComponent has a method called componentWillRecieveProps(). Did ' +
        'you mean componentWillReceiveProps()?',)
    }
    let rendered;    
    CurrentOwner.current = component;
    rendered = vNode._rendered = component.render();
    CurrentOwner.current = null;
    
    return rendered
}



export function mountComponent(vNode, parentContext, parentComponent) {
    const {  props, type, ref } = vNode;
    const component =instanizeComponent(vNode,parentContext);
    component.vNode = vNode;
    if (isComponent(parentComponent)) {
        component._parentComponent = parentComponent;
    }
    if (hasLifeCycle('componentWillMount',component)) {
        component.componentWillMount();
        component.state = component.getState();
    }
    
    const rendered=renderComponent(vNode,component)
    const dom = (vNode.dom = createDomNode(
        rendered,
        getChildContext(component, parentContext),
        parentComponent,
        false
    ));
    component._disable = false;
    return dom;
}

export function mountStateLessComponent(vNode, parentContext, parentComponent){
    const { props, type, ref } = vNode;
    if (ref){
        console.error('stateless component do not support ref ')
    }
    CurrentOwner.current = null;    
    const rendered=(vNode._rendered = type(props))
    const dom = (vNode.dom = createDomNode(
        rendered,
        getChildContext(vNode, parentContext),
        parentComponent,
        false
    ));
    return dom
}
