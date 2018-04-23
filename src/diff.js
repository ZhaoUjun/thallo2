import { createDomNode } from "./createDomNode";
import { NODE_TAG } from "./constant";
import { reRenderComponent } from "./life-cycle/reRenderComponent";
import { isSameNode } from "./utils";

export default function diff(preVNode, nextVnode, prarentDom) {
    let dom = window.document.createTextNode("");
    if (isSameNode(preVNode, nextVnode)) {
        if (nextVnode.tag & NODE_TAG.NORMAL_COMPONENT) {
            dom = reRenderComponent(preVNode, nextVnode);
        } else if (nextVnode.tag & NODE_TAG.STATELESS) {
            dom = reRenderStateLess(preVNode, nextVnode, prarentDom);
        } else if (nextVnode.tag & NODE_TAG.NODE) {
            preVNode.unmount(prarentDom);
            dom = createDomNode(nextVnode);
            prarentDom.appendChild(dom);
        }
    } else {
        preVNode.unmount(prarentDom);
        dom = createDomNode(nextVnode);
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

function diffHostNode(preVNode,nextVnode,prarentDom){
    const dom =(nextVnode.dom=preVNode.dom)
    dom.vNode=nextVnode;

}

function diffAttributes(preProps,nextProps,dom){
    
}
