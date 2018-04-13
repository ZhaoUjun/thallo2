import * as ReactDom from './ReactDom'

export function createElement (type,props,...args){
    const  children=Array.from(args)
    const  mergeProps=props?Object.assign(props,{children}):{children};
    return {type,props:mergeProps}
}

export class Component {
    constructor(props,context){
        this.context = context;
        this.props = props || {};
        this.state = this.state || {};
        this.refs = {};
    }

    get isReactComponent(){
        return true
    }


}



export default{
    createElement,
    ReactDom,
}