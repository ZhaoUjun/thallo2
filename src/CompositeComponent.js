import { instantiateComponent } from './instantiateComponent'
import { isClass, getChildrenfromProps } from './utils'
import { reRendercomponent } from './update'
import { mountComponent } from './life-cycle/mountComponent'

export class CompositeComponent {
    constructor(element){
        this.type=element.type;
        this.component=null;
        this._rendered=null;
        this.dom=null;
        delete props.owner
        if ((this.ref = props.ref)) {
          delete props.ref
        }
        this.props=element.props;
        this._owner = this.props.owner
    }

    getPublicInstance(){
        return this.publicInstance;
    }

    mount(parentContext, parentComponent){
        return mountComponent(this,parentContext, parentComponent)
    }

    update(previous,current){
        reRendercomponent(previous,this)
    }

    
}