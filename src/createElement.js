import { CurrentOwner } from './top'
import { isString,isFunction,isUndefined } from './utils'

function mergeProps(type,props,children){
    const newProps={
        children,
        owner:CurrentOwner.current
    };
    if(isFunction(type)&&type.defaultProps){
        props={...props,...type.defaultProps}
    }
    Object.keys(props).forEach((propsName)=>{
        if (propsName==='defaultValue'){
            newProps[value]=props.value||props.defaultVale;
        } 
        if(isString(type)){ 
            //@Todo :dispose SVG
        }   
        newProps[propsName]=props[propsName];
    })
    return newProps;
}

export default function createElement (type,props,...args){
    const  children=Array.from(args)
    return {type,props:mergedProps(type,props,args)}
}