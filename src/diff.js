import {createDomNode} from './createDomNode'
import {NODE_TAG} from './constant'
import {reRenderComponent } from './life-cycle/reRenderComponent'
export default function diff(preVNode,nextVnode,prarentDom){
    let dom
    if(preVNode.type===nextVnode.type){
        if(nextVnode.tag&NODE_TAG.NORMAL_COMPONENT){
            dom=reRenderComponent(nextVnode,prarentDom)
        }else if(nextVnode.tag&NODE_TAG.STATELESS){

        }else if(nextVnode.tag&NODE_TAG.NODE){

        }

        preVNode.unmount(prarentDom);
        dom = createDomNode(nextVnode);
        prarentDom.appendChild(dom);
        return dom
    }else{
        preVNode.unmount(prarentDom);
        dom = createDomNode(nextVnode);
        prarentDom.appendChild(dom);
        return dom
    }
}