import { updateComponent } from "./life-cycle/updateComponent";
import { renderQueue } from "./top";
import { defer } from "./utils";

export function enqueueRender (component) {
    if(component._sync){
        updateComponent(component)
        return
    }
    if (
        !component._dirty &&
        (component._dirty = true) &&
        renderQueue.push(component)
    ) {
        defer(flushQueue);
    }
}

function flushQueue() {
    let c;
    while ((c = renderQueue.pop())) {
        if (c._dirty) {
            updateComponent(c);
        }
    }
}
