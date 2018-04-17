import { instantiateComponent } from './instantiateComponent'
import { isClass, getChildrenfromProps } from './utils'
import { reRendercomponent } from './update'
import { mountComponent } from './life-cycle/mountComponent'
import { NODE_TAG } from './constant'
import { mountVNode } from './createDomNode'

export class NormalComponent {

    tag=NODE_TAG.NORMAL_COMPONENT;

    constructor(element){
        const {props,type}=element;
        this.type = type
        this.name = type.name || type.toString().match(/^function\s*([^\s(]+)/)[1]
        type.displayName = this.name
        this._owner = props.owner
        delete props.owner
        if ((this.ref = props.ref)) {
          delete props.ref
        }
        this.props = props
        this.key = props.key || null
        this.dom = null
    }

    mount(parentContext, parentComponent){
        return mountComponent(this,parentContext, parentComponent)
    }

    update(previous,current){
        reRendercomponent(previous,this)
    }

    unmount(){

    }
}

export class HostNode {

    tag=NODE_TAG.NODE

    constructor(element){
        const {props,type}=element;
        this.type = type
        this.namespace=props.namespace
        this._owner = props.owner
        delete props.owner
        if ((this.ref = props.ref)) {
            delete props.ref
          }
        this.props = props
        this.key = props.key || null
        this.dom = null
    }

    mount(parentContext,parentComponent){
        return mountVNode(this,parentContext,parentComponent,)
    }
}

export class TextNode {

    tag=NODE_TAG.TEXT

    constructor(element){
        this.text=element;
        this.dom=null;
    }

    mount(parentContext,parentComponent){
        const textNode =(this.dom= window.document.createTextNode(this.text));
        return textNode

    }
}