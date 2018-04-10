/**
 * 
 */
export function createElement (type,props,...children){
    props.children=children;
    return {type,props}
}



export default{
    createElement
}