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
    Object.keys(props).forEach(propsName => {
        if(propsName==='children'){
            return
        }
        node.setAttribute(propsName,props[propsName])
    });
}