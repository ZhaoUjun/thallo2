import { isFunction, isObject, isArray, isNumber, isString } from "./utils";
import { EMPTY_OBJ } from "./constant";
import { enqueueRender } from "./render-queue";
import { updateComponent } from "./life-cycle/updateComponent";

export class Component {
	_sync = false;
	_disable = false;
	_dirty = false;
	_pendingStates = [];
	_depth = 0;

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
		// @todo setStateSync
		if (!this._disable) {
			// ensure can not rerender during some life-cycle
			enqueueRender(this);
		}
	}

	getState() {
		if (isArray(this.state) || isNumber(this.state) || isString(this.state)) {
			throw new Error("Foo.state: must be set to an object or null");
		}
		let collector = {};
		let pendingState;
		const initState = this.state || {};

		while ((pendingState = this._pendingStates.pop())) {
			collector = {
				...collector,
				...(isFunction(pendingState)
					? pendingState.call(this, this.state, this.props)
					: pendingState)
			};
		}
		return { ...initState, ...collector };
	}

	forceUpdate() {
		updateComponent(this, true);
	}
}
