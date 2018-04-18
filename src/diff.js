import {createDomNode} from './createDomNode'

export default function diff(preVNode,nextVnode,prarentDom){
    preVNode.unmount(prarentDom);
    const dom = createDomNode(nextVnode);
    prarentDom.appendChild(dom);
    return dom
}