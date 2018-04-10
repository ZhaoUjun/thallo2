/**
 * 
 */
export function createElement (type,props,...args){
    props.children=Array.from(args);
    return {type,props}
}



export default{
    createElement
}