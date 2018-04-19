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

function reRenderStateLess(preVNode, nextVnode, prarentDom) {
    const { props, type } = nextVnode;
    const rendered = (nextVnode._rendered = type(props));
    return diff(preVNode._rendered, rendered, prarentDom);
}
