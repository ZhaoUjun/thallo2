export class SyntheticEvent {
    constructor(type, nativeEvent) {
        this.type = type;
        this.target = nativeEvent.target;
        this.nativeEvent = nativeEvent;
        this.timeStamp = new Date() - 0;
        this._isPropagationStopped = false;
        this._isDefaultPrevented = false;
        this._isPersisted = false;
    }
    stopPropagation() {
        this._isPropagationStopped = true;

        const { nativeEvent } = this;

        if (nativeEvent.stopPropagation) {
            nativeEvent.stopPropagation();
        } else {
            nativeEvent.cancelBubble = true;
        }
    }

    get isPropagationStopped() {
        return this._isPropagationStopped;
    }

    preventDefault() {
        this._isDefaultPrevented = true;

        const { nativeEvent } = this;

        if (nativeEvent.preventDefault) {
            nativeEvent.preventDefault();
        } else {
            nativeEvent.returnValue = false;
        }
    }

    isDefaultPrevented() {
        return this._isDefaultPrevented;
    }

    persist() {
        this._isPersisted = true;
    }

    stopImmediatePropagation() {
        this.stopPropagation();
        this.stopImmediate = true;
    }

    toString() {
        return "[object Event]";
    }

    nullify() {
        this.type = null;
        this.target = null;
        this.nativeEvent = null;
        this.timeStamp = null;
        this._isPropagationStopped = false;
        this._isDefaultPrevented = false;
        this._isPersisted = false;
    }
}
