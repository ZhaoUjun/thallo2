import { NODE_TAG } from "../constant";
import {
    getChildrenfromProps,
    isClass,
    isComponent,
    isFunction,
    isNotNullOrUndefined,
    hasLifeCycle,
    isString,
    isNumber,
    isIterator,
    isValidContainer
} from "../utils";
import Ref from "../Ref";

export function unmount(vNode,parentDom){
    const{tag,}=vNode
    if (
        tag &
        (NODE_TAG.NORMAL_COMPONENT |
            NODE_TAG.STATELESS |
            NODE_TAG.NODE |
            NODE_TAG.TEXT)
    ) {
        vNode.unmount(parentDom);
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
    const vNode = containerDom._reactRootContainer;
    if (vNode) {
        vNode.unmount(containerDom);
        delete containerDom._reactRootContainer
        return true
    } else {    
        containerDom.innerHtml = "";
        delete containerDom._reactRootContainer        
        return false
    }
}

export function unmountComponentAtNode(containerDom){
    if(!isValidContainer(containerDom)){
        throw  new Error('unmountComponentAtNode(...): Target container is not a DOM element.')
    }
    return unmountTree(containerDom)
}
