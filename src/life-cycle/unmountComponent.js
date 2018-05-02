import { NODE_TAG } from "../constant";
import {
    getChildrenfromProps,
    isClass,
    isComponent,
    isFunction,
    isNotNullOrUndefined,
    hasLifeCycle
} from "../utils";
import Ref from "../Ref";
// import { render } from '../ReactDom';

export function unmount(vNode,parentDom){
    const{tag}=vNode
    if (
        tag &
        (NODE_TAG.NORMAL_COMPONENT |
            NODE_TAG.STATELESS |
            NODE_TAG.NODE |
            NODE_TAG.TEXT)
    ) {
        vNode.unmount(parentContext, parentComponent);
    } else if (isString(vNode) || isNumber(vNode)) {

        
    } else if (isIterator(vNode)) {
        // domNode = window.document.createDocumentFragment();
        vNode.forEach(item => {
            unmount(item,parentDom)
        });
    }
}

export function unmountComponent(vNode, parentDom) {
    const { component, _rendered, dom } = vNode;
    if (
        hasLifeCycle('componentWillUnmount',component)
    ) {
        component.componentWillUnmount();
    }
    _rendered.unmount();
    removeDom(vNode, parentDom);
}

export function unmountStateLessComponent(vNode,parentDom){
    const { _rendered, dom } = vNode;
    _rendered.unmount();
    removeDom(vNode, parentDom);
}

export function unmountHostNode(vNode, parentDom) {
    const { dom, props } = vNode;
    unmountChildren(getChildrenfromProps(props), dom);
    removeDom(vNode, parentDom);
}

export function unmountTextNode(vNode, parentDom) {
    removeDom(vNode, parentDom);
}

function unmountChildren(children, parentDom) {
    children.forEach(vNode => {
        vNode.unmount && vNode.unmount(parentDom);
    });
}

function removeDom(vNode, parentDom) {
    //@todo dettachEvenet
    const { dom, ref } = vNode;
    if (ref) {
        Ref.detach(vNode, ref, dom);
    }
    if (dom && parentDom) {
        parentDom.removeChild(dom);
    }
}

export function unmountTree(containerDom) {
    const vNode = containerDom._component;
    if (vNode) {
        vNode.unmount(containerDom);
    } else {
        containerDom.innerHtml = "";
    }
}
