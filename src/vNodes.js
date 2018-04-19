import { isClass, getChildrenfromProps,isString,isFunction } from "./utils";
import { reRendercomponent } from "./update";
import { mountComponent,mountStateLessComponent } from "./life-cycle/mountComponent";
import {
    unmountComponent,
    unmountHostNode,
    unmountStateLessComponent
} from "./life-cycle/unmountComponent";
import { NODE_TAG } from "./constant";
import { mountVNode } from "./createDomNode";

function Base (props,type){
    this.type = type;
    this._owner = props.owner;
    delete props.owner;
    if ((this.ref = props.ref)) {
        delete props.ref ;
    }
    this.props = props;
    this.key = props.key || null;
    this.dom = null;
}

export class NormalComponent {
    tag = NODE_TAG.NORMAL_COMPONENT;

    constructor(element) {
        const { props, type } = element;
        Base.call(this,props,type)
        this.name =type.name || type.toString().match(/^function\s*([^\s(]+)/)[1];
        type.displayName = this.name;
    }

    mount(parentContext, parentComponent) {
        return mountComponent(this, parentContext, parentComponent);
    }

    update(previous, current) {
        reRendercomponent(previous, this);
    }

    unmount(parentDom) {
        return unmountComponent(this, parentDom);
    }
}

export class StateLessCompoent{
    tag = NODE_TAG.STATELESS;

    constructor(element) {
        const { props, type } = element;
        Base.call(this,props,type)
    }

    mount(parentContext, parentComponent) {
        
        return mountStateLessComponent(this, parentContext, parentComponent);
    }

    unmount(parentDom) {
        return unmountStateLessComponent(this, parentDom);
    }
}

export class HostNode {
    tag = NODE_TAG.NODE;

    constructor(element) {
        const { props, type } = element;
        Base.call(this,props,type)
        this.namespace = props.namespace;
    }

    mount(parentContext, parentComponent) {
        return mountVNode(this, parentContext, parentComponent);
    }

    unmount(parentDom) {
        return unmountHostNode(this, parentDom);
    }
}

export class TextNode {
    tag = NODE_TAG.TEXT;

    constructor(element) {
        this.text = element;
        this.dom = null;
    }

    mount(parentContext, parentComponent) {
        const textNode = (this.dom = window.document.createTextNode(this.text));
        return textNode;
    }

    unmount(parentDom) {
        return unmountHostNode(this, parentDom);
    }
}
