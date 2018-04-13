import { updateComponent } from './updater'

const queue=[];

export function putIntoQueue (component){
    if(!component._dirty&&(component._dirty=true)&&queue.push(component)){
        
    }
}

function flushQueue (){
    let c;
    while((c=queue.pop())){
        if(!c._dirty){
            updateComponent(c)
        }
    }
}