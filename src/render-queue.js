import { updateComponent } from "./life-cycle/updateComponent";
import { dirtyComponents,readyWorks } from "./top";
import { defer } from "./utils";

export function enqueueRender (component) {
    if(component._sync){
        updateComponent(component)
        return
    }
    if (
        !component._dirty &&
        (component._dirty = true) &&
        dirtyComponents.push(component)
    ) {
        defer(flushQueue);
    }
}

function flushQueue() {
    let component;
    while ((component = dirtyComponents.pop())) {
        if (component._dirty) {
            updateComponent(component);
        }
    }
    readyWorks.flushWorks()
}
