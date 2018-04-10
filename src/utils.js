export function isClass (elementType){
    return (
        Boolean(elementType.prototype) &&
        Boolean(elementType.prototype.isReactComponent)
      )
}