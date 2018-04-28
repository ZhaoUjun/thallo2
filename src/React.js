import * as ReactDom from "./ReactDom";

import createElement from "./createElement";

// export function createElement (type,props,...args){
//     const  children=Array.from(args)
//     const  mergeProps=props?Object.assign(props,{children}):{children};
//     return {type,props:mergeProps}
// }

export default {
    createElement,
    ReactDom
};
