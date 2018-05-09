import { updateComponent } from "./updateComponent";
import { CurrentOwner } from "../top";
import { isFunction, isNotNullOrUndefined, hasLifeCycle } from "../utils";
import Ref from "../Ref";

export function reRenderComponent(preVnode, nextVnode) {
    const preProps = preVnode.props;
    const nextProps = nextVnode.props;
    const component = (nextVnode.component = preVnode.component);
    component._disable = true; //avoid updating again when call setState in this hook
    if (hasLifeCycle("componentWillReceiveProps", component)) {
        component.componentWillReceiveProps(nextProps);
    }
    component._disable = false;
    component.preProps = preProps;
    component.preState = component.state;
    component.preContext = component.context;
    component.props=nextProps;
    component.vNode=nextVnode;
    nextVnode._rendered=preVnode._rendered;
    return updateComponent(component,false,preVnode);
}
