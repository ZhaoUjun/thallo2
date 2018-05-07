import { SyntheticEvent } from './SyntheticEvent'

const globalEventCollects = new WeakMap();
const eventPool=new WeakMap();
const eventCount = Object.create(null);// sum the same type event 

const globalListner = function(e) {
    let { type, target } = e,
        syntheticEvent=eventPool.get(type)
    ;
    while (target && target !== document) {
        if (
            globalEventCollects.has(target) &&
            globalEventCollects.get(target)[type]
        ) {
            const handler =globalEventCollects.get(target)[type]
            handler(syntheticEvent||(syntheticEvent=new SyntheticEvent(type,e)));
            if(syntheticEvent.isPropagationStopped()){
                return 
            }
        }
        target = target.parentNode;
    }
    if(syntheticEvent._isPersisted&&!eventPool.has(type)){
        eventPool.set(type,syntheticEvent)
    }else{
        //@todo nullify syntheticEvent
    }
};

export const globalEvent = {
    add: function(dom, name, handler) {
        let handlers = Object.create(null);
        if (!eventCount[name]) {
            eventCount[name] = 0;
            document.addEventListener(name, globalListner);
        } else {
            handlers = globalEventCollects.get(dom);
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
