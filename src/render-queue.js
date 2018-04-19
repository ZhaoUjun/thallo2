import { updateComponent } from "./life-cycle/updateComponent";
import { dirtyComponent } from "./top";
import { defer } from "./utils";

export function enqueueRender (component) {
    if(component._sync){
        updateComponent(component)
        return
    }
    if (
        !component._dirty &&
        (component._dirty = true) &&
        dirtyComponent.push(component)
    ) {
        defer(flushQueue);
    }
}

function flushQueue() {
    let component;
    while ((component = dirtyComponent.pop())) {
        if (component._dirty) {
            updateComponent(component);
        }
    }
}
