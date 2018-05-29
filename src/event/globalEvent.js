import { SyntheticEvent } from "./SyntheticEvent";
const globalEventCollects = new WeakMap();
// const eventPool = new Map(); @todo make event pooled
const eventCount = Object.create(null); // sum the same type event

const globalListner = function(e) {
    let { type, target } = e,
        count = eventCount[type],
        syntheticEvent,
        handler;
    while (count > 0 && target) {
        if (
            globalEventCollects.has(target) &&
            (handler = globalEventCollects.get(target)[type])
        ) {
            handler(
                syntheticEvent || (syntheticEvent = new SyntheticEvent(type, e))
            );
            count--;
            if (syntheticEvent.isPropagationStopped) {
                return;
            }
        }
        if (target === document) {
            return;
        }
        target = target.parentNode;
    }
    if (syntheticEvent && !syntheticEvent._isPersisted) {
        /**
         * it will be nullify after in the end of this tick
         *  https://reactjs.org/docs/events.html#ui-events
         */

        syntheticEvent.nullify();
    }
};

export const globalEvent = {
    add: function(dom, name, handler) {
        let handlers = Object.create(null);
        if (!eventCount[name]) {
            eventCount[name] = 0;
            document.addEventListener(name, globalListner);
        } else {
            handlers = globalEventCollects.get(dom) || Object.create(null);
        }
        handlers[name] = handler;
        eventCount[name]++;
        globalEventCollects.set(dom, handlers);
    },
    remove: function(dom, name) {
        const handlers = globalEventCollects.get(dom) || {};
        if (handlers[name]) {
            delete handlers.name;
            eventCount[name]--;
        }
        if (eventCount[name] === 0) {
            document.removeEventListener(name, globalListner);
        }
    }
};
