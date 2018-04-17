import { NODE_TAG } from './constant'
import { getChildrenfromProps } from './utils'
import { attachAttributes } from './DomProperty'

export function createDomNode (vNode,parentContext,parentComponent,isSvg=false){
    const {tag}=vNode;
    let domNode;
    if(tag & (NODE_TAG.NORMAL_COMPONENT | NODE_TAG.STATELESS | NODE_TAG.NODE)){
        domNode=vNode.mount(parentContext,parentComponent)
    }
    return domNode
}


export function mountVNode(vNode,parentContext,parentComponent,isSvg){
    const {type,ref,props}=vNode;
    const dom = (vNode.dom= window.document.createElement('type'));
    attachAttributes(dom,props);    
    const children =getChildrenfromProps(props);
    if(children){
        // const renderedChildren=(vNode._rendered=children.map(instantiateComponent));
        // renderedChildren
            children
            .map((vnode)=>createDomNode(vNode,parentContext,parentComponent,isSvg))
            .forEach(childNode=>dom.appendChild(childNode))
    }
    return dom
}

