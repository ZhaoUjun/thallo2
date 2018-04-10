import { CompositeComponent } from './CompositeComponent'
import { DomComponent } from './DomComponent'

export function instantiateComponent (element){
    const {type}=element;
    if (type==='function'){
        return new CompositeComponent(element)
    }
    else if (type==='string'){
        return new DomComponent(element)
    }
}