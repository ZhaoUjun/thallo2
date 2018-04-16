import { CompositeComponent } from './CompositeComponent'
import { DomComponent } from './DomComponent'
import { NormalComponent } from './NormalComponent'
import { isClass } from './utils'

export function instantiateComponent (element){
    if(typeof element ==='string'){
        return element
    }
    const {type}=element;
    if (typeof type==='function'){
        return isClass(type)? new NormalComponent(element):
                new NormalComponent(element)
    }
    else if (typeof type==='string'){
        return new DomComponent(element)
    }
}

