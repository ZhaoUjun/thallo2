import { createDomNode } from "./createDomNode";
import { NODE_TAG } from "./constant";
import { reRenderComponent } from "./life-cycle/reRenderComponent";
import { isSameNode } from "./utils";

export default function diff(preVNode, nextVNode, prarentDom) {
    let dom = window.document.createTextNode("");
    if (isSameNode(preVNode, nextVNode)) {
        if (nextVNode.tag & NODE_TAG.NORMAL_COMPONENT) {
            dom = reRenderComponent(preVNode, nextVNode);
        } else if (nextVNode.tag & NODE_TAG.STATELESS) {
            dom = reRenderStateLess(preVNode, nextVNode, prarentDom);
        } else if (nextVNode.tag & NODE_TAG.NODE) {
            preVNode.unmount(prarentDom);
            dom = createDomNode(nextVNode);
            prarentDom.appendChild(dom);
        }

    } else {
        preVNode.unmount(prarentDom);
        dom = createDomNode(nextVNode);
        prarentDom.appendChild(dom);
        
    }
    return dom;
}

export function patchAtr(preVNode,nextVnode,isSvg){
    const domNode =preVNode.dom;
    const preProps=preVNode.props;
    const nextProps=nextVnode.props;
    Object.keys(nextProps).forEach(propName=>{
        if(propName!=='children'){
            
        }
    })
}

function reRenderStateLess(preVNode, nextVnode, prarentDom) {
    const { props, type } = nextVnode;
    const rendered = (nextVnode._rendered = type(props));
    return diff(preVNode._rendered, rendered, prarentDom);
}

function diffHostNode(preVNode,nextVNode,prarentDom){
    const dom =(nextVNode.dom=preVNode.dom)
    dom.vNode=nextVNode;

}

function diffChildren(preVNode,nextVNode){

}

function diffAttributes(preProps,nextProps,dom){

}
