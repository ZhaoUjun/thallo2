export function isClass (elementType){
    return (
        Boolean(elementType.prototype) &&
        Boolean(elementType.prototype.isReactComponent)
      )
}

export function isArray (obj){
    return Array.isArray(obj)
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