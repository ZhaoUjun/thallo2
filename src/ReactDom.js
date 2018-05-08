import { createDomNode } from "./createDomNode";
import { isComposite ,isFunction,isValidContainer} from "./utils";
import diff from './diff'

export function render(vnode, container, callback) {
    if(!isValidContainer(container)){
        throw new Error('Target container is not a DOM element.asda')
    }
    let dom;
    if(container._reactRootContainer){
        // console.log(container._reactRootContainer)
        dom=diff(container._reactRootContainer,vnode,container)
    }
    else{
        dom = createDomNode(vnode);
        container.appendChild(dom);
    }
    if(isFunction(callback)){
        callback.call(dom)
    }
    container._reactRootContainer = vnode;    
    return isComposite(vnode) ? vnode.component : dom;
}

export function findDOMNode(component){
    return component.vNode.dom
}
