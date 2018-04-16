import { NODE_TAG } from '../constant'
import { getChildrenfromProps, isClass, isComponent, isFuntion } from '../utils'
import { CurrentOwner} from '../top'

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
    CurrentOwner.current=component
    vNode._rendered=component.render();
    CurrentOwner.current=null;
    
    if(isFuntion(component.componentDidMount)){
        component.componentDidMount()
    }
    
}