import { NODE_TAG } from "./constant";
import { getChildrenfromProps, isString, isNumber, isIterator } from "./utils";
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
    } else if (isIterator(vNode)) {
        domNode = window.document.createDocumentFragment();
        vNode.forEach(item => {
            domNode.appendChild(createDomNode(item,parentContext,parentComponent));
        });
    }
    return domNode;
}

export function mountVNode(vNode, parentContext, parentComponent, isSvg) {
    const { type, ref, props } = vNode;
    const dom = (vNode.dom = window.document.createElement(type));
    attachAttributes(dom, props);
    const children = getChildrenfromProps(props);
    if (children) {
        for (let childVNode of children) {
            dom.appendChild(
                createDomNode(childVNode, parentContext, parentComponent, isSvg)
            );
        }
    }
    if (ref) {
        Ref.attach(vNode, ref, dom);
    }
    return dom;
}
