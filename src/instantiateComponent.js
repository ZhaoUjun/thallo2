import { CompositeComponnet } from './CompositeComponent'
import { DomComponent } from './DomComponent'

export function instantiateComponent (element){
    const {type}=element;
    if (type==='function'){
        return new CompositeComponnet(element)
    }
    else if (type==='string'){
        return new DomComponent(element)
    }
}