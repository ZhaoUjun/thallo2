import { isFuntion, isRef } from "./utils";
import { enableUpdate, disableUpdate } from "./updater";

export function reRendercomponent(previous, current) {
    const component = previous.getPublicInstance();
    const currentIns = current.getPublicInstance();
    const nextProps = currentIns.props;
    const nextContext = current.context;
    disableUpdate(component);
    if (isFuntion(component.componentWillReceiveProps)) {
        component.componentWillReceiveProps(nextProps.nextContext);
    }
    enableUpdate(component);
    component.preState = component.state;
    component.preProps = component.prrops;
    component.props = nextProps;
    component.context = nextContext;
    if (isRef(component.ref)) {
    }
}
