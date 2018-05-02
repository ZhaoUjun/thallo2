import { isFunction } from "./utils";
import { EMPTY_OBJ } from "./constant";
import { enqueueRender } from "./render-queue";

export class Component {
    _sync=false;
    _disable = false;
    _dirty = false;
    _pendingStates = [];
    _depth=0;

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
