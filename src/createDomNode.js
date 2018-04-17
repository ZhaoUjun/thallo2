import { NODE_TAG } from './constant'
import { getChildrenfromProps, isString } from './utils'
import { attachAttributes } from './DomProperty'

export function createDomNode (vNode,parentContext,parentComponent,isSvg=false){
    const {tag}=vNode;
    let domNode;
    if(tag & (NODE_TAG.NORMAL_COMPONENT | NODE_TAG.STATELESS | NODE_TAG.NODE | NODE_TAG.TEXT)){
        domNode=vNode.mount(parentContext,parentComponent)
    }
    else if(isString(vNode)){
        domNode=window.document.createTextNode(vNode)
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
            .map((childVNode)=>createDomNode(childVNode,parentContext,parentComponent,isSvg))
            .forEach(childDomNode=>{
                console.log(childDomNode)
                dom.appendChild(childDomNode)
            })
    }
    return dom
}

