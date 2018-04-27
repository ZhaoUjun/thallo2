import { BUBBLE_EVENTS, UNBUBBLE_EVENTS } from "./eventTypes";
import { globalEvent } from "./globalEvent";

export function isEventName(name) {
    return /^on[A-Z]/.test(name);
}

function parseEventName(type) {
    return type.substr(2).toLowerCase();
}

export function addEventHandler(dom, type, handler) {
    if (!isEventName(type)) {
        return;
    }
    const name = parseEventName(type);
    if (BUBBLE_EVENTS.includes(name)) {
        addHandlerToGlobal(dom, name, handler);
    }
}

export function addHandlerToDom(dom, type, handler) {
    dom.addEventListner(type, handler, false);
}

export function addHandlerToGlobal(dom, type, handler) {
    globalEvent.add(dom, type, handler);
}

export function removeEventHandler() {}
