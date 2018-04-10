import { CompositeComponent } from './CompositeComponent'
import { DomComponent } from './DomComponent'

export function instantiateComponent (element){
    if(typeof element ==='string'){
        return element
    }
    const {type}=element;
    if (typeof type==='function'){
        return new CompositeComponent(element)
    }
    else if (typeof type==='string'){
        return new DomComponent(element)
    }
}

