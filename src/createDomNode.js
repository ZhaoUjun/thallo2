import {NODE_TAG} from './constant'

export function createDomNode (vNode,parentContext,parentComponent,isSvg=false){
    const {tag}=vNode;
    let domNode;
    if(tag & (NODE_TAG.NORMAL_COMPONENT | NODE_TAG.STATELESS)){
        domNode=vNode.mount(parentContext,parentComponent)
    }
    else if (tag & NODE_TAG.NODE) {
        return 
    }
    return domNode
}

