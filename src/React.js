import * as ReactDom from "./ReactDom";
import { isFunction } from "./utils";
import { EMPTY_OBJ } from "./constant";
import { enqueueRender } from "./render-queue";
import createElement from "./createElement";

// export function createElement (type,props,...args){
//     const  children=Array.from(args)
//     const  mergeProps=props?Object.assign(props,{children}):{children};
//     return {type,props:mergeProps}
// }

export class Component {
    _sync=true;
    _disable = false;
    _dirty = false;
    _pendingStates = [];

    constructor(props, context) {
        this.context = context || EMPTY_OBJ;
        this.props = props;
        this.refs = {};
    }

    get isReactComponent() {
        return EMPTY_OBJ;
    }

    setState(state, callback) {
        if (state) {
            (this._pendingStates = this._pendingStates || []).push(state);
        }
        if (callback) {
            (this._callbackQueue = this._callbackQueue || []).push(callback);
        }
        //@todo setStateSync
        if(!this._disable){
            //ensure can not rerender during some life-cycle
            enqueueRender(this);
        }
    }

    getState() {
        let collector = {};
        let s;
        while ((s = this._pendingStates.pop())) {
            collector = {
                ...collector,
                ...(isFunction(s) ? s.call(this, this.state, this.props) : s)
            };
        }
        return { ...this.state, ...collector };
    }
}

export default {
    createElement,
    ReactDom
};
