import { getChildrenfromProps,setAttribute } from './utils'
import { instantiateComponent } from './instantiateComponent'
export class DomComponent {
    constructor(element){
        this.currentElement=element;
        this.renderedChildren=null;
        this.node=null;
    }

    getPulicInstance(){
        return this.node;
    }

    mount(){
        const {type,props}=this.currentElement;
        const children=getChildrenfromProps(props);
        this.node=document.createElement(type);
        this.renderedChildren=children.map(instantiateComponent);
        this.renderedChildren
            .map(child=>{
                if(typeof child==='string'){
                    return document.createTextNode(child)
                }
                return child.mount()
            })
            .map(childNode=>this.node.appendChild(childNode))
        setAttribute(this.node,props);
        return this.node
    }
}