import { updateComponent } from './updater'
import { renderQueue } from './top'
import { defer } from './utils'

export function enterQueue (component){
    if(!component._dirty&&(component._dirty=true)&&renderQueue.push(component)){
        defer(flushQueue)
    }
}

function flushQueue (){
    let c;
    while((c=renderQueue.pop())){
        if(!c._dirty){
            updateComponent(c)
        }
    }
}