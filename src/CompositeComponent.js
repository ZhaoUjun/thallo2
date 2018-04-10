import { instantiateComponent } from './instantiateComponent'
import { isClass } from './utils'

export class CompositeComponent {
    constructor(element){
        this.currentElement=element;
        this.publicInstance=null;
        this.renderedComponent=null;
    }

    getPublicInstance(){
        return this.publicInstance;
    }

    mount(){
        const {type,props}=this.currentElement;
        const children=getChildrenfromProps(props);
        let renderedElement;
        if (isClass(type)){
            this.publicInstance=new type(props);
            if (this.publicInstance.componentWillMount){
                this.publicInstance.componentWillMount()
            }
            renderedElement=this.publicInstance.render();
        }
        else {
            this.publicInstance=null;
            renderedElement=type(props);
        }
        this.renderedComponent=instantiateComponent(renderedElement);
        return this.renderedComponent.mount()
    }
}