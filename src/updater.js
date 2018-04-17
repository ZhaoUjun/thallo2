import { diff } from "./diff";
export function updateComponent(component, isForce) {
    const { props, context } = component;
    const state = component.getState;
    const lastElement = component.currentElement;
    const nextElement = component.render();
}

export function disableUpdate(component) {
    component._canUpdate = true;
}

export function enableUpdate(component) {
    component._canUpdate = false;
}
