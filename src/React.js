import * as ReactDom from './ReactDom'

export function createElement (type,props,...args){
    const  children=Array.from(args)
    const  mergeProps=props?Object.assign(props,{children}):{children};
    return {type,props:mergeProps}
}

class Component {
    constructor(props,context){
        this.context = context;
        this.props = props;
        this.refs = {};
        this.state = null;
        this.isReactComponent=true;
    }

}



export default{
    createElement,
    ReactDom
}