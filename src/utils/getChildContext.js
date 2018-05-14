import{isFunction} from './index'
export function getChildContext(component, parentContext = {}) {
    let childContext;
    if(isFunction(component.getChildContext)){
        childContext=component.getChildContext()
    }
    return childContext
        ? {  ...parentContext,...childContext }
        : parentContext;
}
