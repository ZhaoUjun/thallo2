import { NODE_TAG } from '../constant'
import { getChildrenfromProps,isClass } from '../utils'

export function mountComponent(vNode,parentContext,parentComponentp){
    const children=getChildrenfromProps(vNode.props);
    let renderedElement;
    if (isClass(vNode.type)){
        vNode.publicInstance=new type(vNode.props);
        if (vNode.publicInstance.componentWillMount){
            vNode.publicInstance.componentWillMount()
        }
        renderedElement=vNode.publicInstance.render();
    }
    else {
        vNode.publicInstance=null;
        renderedElement=vNode.type(vNode.props);
    }
    vNode.component=instantiateComponent(renderedElement);
    return vNode.component.mount()
}