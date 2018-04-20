import { updateComponent } from "./updateComponent";
import { CurrentOwner } from "../top";
import { isFunction, isNotNullOrUndefined } from "../utils";
import Ref from "../Ref";

export function 
reRenderComponent(preVnode, nextVnode) {
    const preProps = preVnode.props;
    const nextProps = nextVnode.props;
    const component = (nextVnode.component = preProps.component);
    component._disable = true; //avoid updating again when call setState in this hook
    if (
        component.componentWillReceiveProps &&
        isFunction(component.componentWillReceiveProps)
    ) {
        component.componentWillReceiveProps(nextProps);
    }
    component._disable = false;
    component.preProps = preProps;
    component.preState = component.state;
    component.preContext = component.context;
    if (isNotNullOrUndefined(nextVnode.ref)) {
        Ref.update(preProps, nextVnode);
    }
    return updateComponent(component);
}
