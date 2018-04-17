import { NODE_TAG } from '../constant'
import { getChildrenfromProps, isClass, isComponent, isFunction, isNotNullOrUndefined } from '../utils'
import { CurrentOwner} from '../top'
import { createDomNode } from '../createDomNode'
import { getChildContext } from '../utils/getChildContext'
import Ref from '../Ref'
import { render } from '../ReactDom';
import { isString } from 'util';

export function unmountComponent(vNode,parentDom){
    const { component,_rendered,dom }=vNode;
    if(component.componentWillUnmount && isFunction(component.componentWillUnmount)){
        component.componentWillUnmount()
    }
    _rendered.unmount();
    removeDom(dom,parentDom)
}

export function unmountHostNode(vNode,parentDom){
    const {dom,_rendered}=vNode;
    //@todo dettachEvenet dettachRef
    unmountChildren(_rendered,parentDom);
    removeDom(dom,parentDom)
}

export function unmountTextNode(vNode,parentDom){
    removeDom(dom,parentDom)
}

function unmountChildren(children,parentDom){
    children.forEach(vNode => {
        const {dom}=vNode;
        vNode.unmount&&vNode.unmount();
        removeDom(dom,parentDom)
    });
}

function removeDom(dom,parentDom){
    if(dom&&parentDom){
        parentDom.removeChildNode(dom)
    }
}



