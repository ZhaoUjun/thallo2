import {NODE_TAG} from './constant'

export function createDomNode (vNode,parentContext,parentComponent,isSvg=false){
    const {tag}=vNode;
    let domNode;
    if(tag===NODE_TAG){
        domNode=vNode.mount(parentContext,parentComponent)
    }
    return domNode
}