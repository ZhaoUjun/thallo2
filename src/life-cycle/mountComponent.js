import { NODE_TAG } from '../constant'
import { getChildrenfromProps, isClass, isComponent, isFuntion, isNotNullOrUndefined } from '../utils'
import { CurrentOwner} from '../top'
import { createDomNode } from '../createDomNode'
import { getChildContext } from '../utils/getChildContext'
import Ref from './Ref'

export function mountComponent(vNode,parentContext,parentComponent){
    const {tag,props,type,ref}=vNode;
    const component=(vNode.component=new type(props,parentContext));
    if (isComponent(parentComponent)) {
        component._parentComponent = parentComponent
    }
    if(isFuntion(component.componentWillMount)){
        component.componentWillMount();
        component.state=component.getState()
    }
    let rendered;
    CurrentOwner.current=component
    rendered=(vNode._rendered=component.render());
    CurrentOwner.current=null;
    
    if(isFuntion(component.componentDidMount)){
        component.componentDidMount()
    }
    if(isNotNullOrUndefined){
        Ref.attach(vNode,ref,vNode.dom)
    }
    const dom =(vNode.dom=createDomNode(
        rendered,
        getChildContext(vNode,parentContext),
        parentComponent,
        false)
    )
    component._disable=false
    return dom
}