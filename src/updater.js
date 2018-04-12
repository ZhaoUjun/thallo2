import { diff } from './diff'
export function updateComponent(component,isForce){
    const {props,context} =component;
    const state =component.getState;
    const lastElement=component.currentElement;
    const nextElement=component.render();
    
}