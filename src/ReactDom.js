import { createDomNode } from "./createDomNode";
import {
    isComposite,
    isFunction,
    isValidContainer,
    isVnode,
    isComponent
} from "./utils";
import diff from "./diff";
import { readyWorks } from "./top";

export function render(vnode, container, callback) {
    if (!isValidContainer(container)) {
        throw new Error("Target container is not a DOM element.asda");
    }
    let dom;
    if (container._reactRootContainer) {
        dom = diff(container._reactRootContainer, vnode, container);
    } else {
        dom = createDomNode(vnode);
        container.appendChild(dom);
    }
    if (isFunction(callback)) {
        callback.call(dom);
    }
    readyWorks.flushWorks();
    container._reactRootContainer = vnode;
    return isComposite(vnode) ? vnode.component : dom;
}

export function findDOMNode(componentOrVnode) {
    if (isVnode(componentOrVnode)) {
        return componentOrVnode.dom;
    } else if (isComponent(componentOrVnode)) {
        return componentOrVnode.vNode.dom;
    } else if (isValidContainer(componentOrVnode)) {
        return componentOrVnode;
    } else {
        return null;
    }
}
