import { createDomNode } from './createDomNode'

export function render(vnode,container){
    const node = createDomNode(vnode);
    container.appendChild(node);
    container._component=vnode
}
