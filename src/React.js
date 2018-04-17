import * as ReactDom from './ReactDom'
import { isFuntion } from './utils'
import { EMPTY_OBJ } from './constant'
import { putIntoQueue } from './render-queue'
import createElement from './createElement'

// export function createElement (type,props,...args){
//     const  children=Array.from(args)
//     const  mergeProps=props?Object.assign(props,{children}):{children};
//     return {type,props:mergeProps}
// }

export class Component {
    _disable=true
    _dirty=true
    _pendingStates=[]
    
    constructor(props,context){
        this.context = context||EMPTY_OBJ;
        this.props = props;
        this.refs = {};
    }


    get isReactComponent(){
        return EMPTY_OBJ
    }

    setState(state,callback){
        if(state){
            (this._pendingStates = this._pendingStates || []).push(state)
        }
        if(callback){
            (this._callbackQueue = this._callbackQueue || []).push(callback)
        }
        putIntoQueue(this)
    }

    getState(){
        let collector={};
        let s;
        while((s =this._pendingStates.pop())){
            collector={...collector,...isFuntion(s)?s.call(this,this.state,this.props):s}
        }
        return {...this.state,...collector}
    }
    
}



export default{
    createElement,
    ReactDom,
}