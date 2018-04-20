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

function reRenderStateLess(preVNode, nextVNode, prarentDom) {
    const { props, type } = nextVNode;
    const rendered = (nextVNode._rendered = type(props));
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
