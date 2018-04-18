import { NODE_TAG } from "./constant";
import { getChildrenfromProps, isString, isNumber } from "./utils";
import { attachAttributes } from "./DomProperty";
import Ref from "./Ref";

export function createDomNode(
    vNode,
    parentContext,
    parentComponent,
    isSvg = false
) {
    const { tag } = vNode;
    let domNode;
    if (
        tag &
        (NODE_TAG.NORMAL_COMPONENT |
            NODE_TAG.STATELESS |
            NODE_TAG.NODE |
            NODE_TAG.TEXT)
    ) {
        domNode = vNode.mount(parentContext, parentComponent);
    } else if (isString(vNode) || isNumber(vNode)) {
        domNode = window.document.createTextNode(vNode);
    }
    return domNode;
}

export function mountVNode(vNode, parentContext, parentComponent, isSvg) {
    const { type, ref, props } = vNode;
    const dom = (vNode.dom = window.document.createElement(type));
    attachAttributes(dom, props);
    const children = getChildrenfromProps(props);
    if (children) {
        children
            .map(childVNode =>
                createDomNode(childVNode, parentContext, parentComponent, isSvg)
            )
            .forEach(childDomNode => {
                dom.appendChild(childDomNode);
            });
    }
    if (ref) {
        Ref.attach(vNode, ref, dom);
    }
    return dom;
}
