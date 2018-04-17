import { NODE_TAG } from "../constant";
import {
    getChildrenfromProps,
    isClass,
    isComponent,
    isFunction,
    isNotNullOrUndefined
} from "../utils";
import Ref from "../Ref";
// import { render } from '../ReactDom';

export function unmountComponent(vNode, parentDom) {
    const { component, _rendered, dom } = vNode;
    if (
        component.componentWillUnmount &&
        isFunction(component.componentWillUnmount)
    ) {
        component.componentWillUnmount();
    }
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
