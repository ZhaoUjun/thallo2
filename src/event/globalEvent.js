const globalEventCollects = new WeakMap();

export const globalEvent = {
    add: function(dom, name, handler) {
        let handlers = Object.create(null);
        if (!globalEventCollects.has(dom)) {
            document.addEventListener(name, globalEvent.handler);
        } else {
            handlers = globalEventCollects.get(dom);
        }
        handlers[name] = handler;
        globalEventCollects.set(dom, handlers);
    },
    remove: function(dom, name) {
        const handlers = globalEventCollects.get(dom) || {};
        if (handlers.name) {
            delete handlers.name;
        }
    },
    handler: function(e) {
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
    }
};
