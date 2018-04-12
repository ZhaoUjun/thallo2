import * as ReactDom from './ReactDom'
import { isFuntion } from './utils'
import { EMPTY_OBJ } from './constant'
import { putIntoQueue } from './render-queue'
import { resolveTxt } from 'dns';

export function createElement (type,props,...args){
    const  children=Array.from(args)
    const  mergeProps=props?Object.assign(props,{children}):{children};
    return {type,props:mergeProps}
}

export class Component {
    constructor(props,context){
        this.context = context||EMPTY_OBJ;
        this.props = props;
        this.refs = {};
        this.state = null;
    }

    get isReactComponent(){
        return true
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