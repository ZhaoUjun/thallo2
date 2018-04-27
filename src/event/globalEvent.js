const globalEventCollects = new WeakMap();

const eventCount = Object.create(null);// sum the same type event 

const globalListner = function(e) {
    let { type, target } = e;
    while (target && target !== document) {
        if (
            globalEventCollects.has(target) &&
            globalEventCollects.get(target)[type]
        ) {
            globalEventCollects.get(target)[type](e);
        }
        target = target.parentNode;
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
