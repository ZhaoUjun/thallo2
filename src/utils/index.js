import { EMPTY_OBJ } from '../constant'
export function isFuntion (obj){
    return typeof obj ==='function'
}

export function isString(string){
    return typeof string ==='string'
}

export function isUndefined(obj){
    return typeof obj ==='undefined'
}

export function isClass (elementType){
    return (
        Boolean(elementType.prototype) &&
        Boolean(elementType.prototype.isReactComponent)
      )
}

export function isArray (obj){
    return Array.isArray(obj)
}

export function isRef(ref){
    return ref||(ref!==null&&ref!==undefined)
}

export function getChildrenfromProps(props){
    const children=props.children||[];
    return isArray(children)?children:[children];
}

export function setAttribute(node,props){
    Object.keys(props).forEach(propName => {
        if(propName==='children'){
            return
        }
        if(propName==='className'){
            node.setAttribute('class',props[propName])
        }
        if(propName==='style'){
            
        }
        node.setAttribute(propName,props[propName])
    });
}

export function isComponent (instance){
    return instance.isReactComponent === EMPTY_OBJ
  }
  

export function defer(fun,...args){
    fun=isFuntion(fun)?fun.bind(null,...args):fun;
    const deferer=requestAnimationFrame||setTimeout;
    return deferer(fun)
}