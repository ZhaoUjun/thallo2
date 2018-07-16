import {
	isClass,
	getChildrenfromProps,
	isString,
	isFunction,
	objHasNullProp
} from "./utils";
import { reRenderComponent } from "./life-cycle/reRenderComponent";
import {
	mountComponent,
	mountStateLessComponent
} from "./life-cycle/mountComponent";
import {
	unmountComponent,
	unmountHostNode,
	unmountStateLessComponent,
	unmountTextNode
} from "./life-cycle/unmountComponent";
import { NODE_TAG, REACT_ELEMENT_TYPE } from "./constant";
import { mountVNode } from "./createDomNode";
import { readyWorks, CurrentOwner } from "./top";

function Base(props, type) {
	this.type = type;
	this._owner = props.owner;
	delete props.owner;
	this.ref = props.ref || null;
	delete props.ref;
	this.key = props.key ? "" + props.key : null;
	delete props.key;
	this.dom = null;
	this.$$typeof = REACT_ELEMENT_TYPE;
	this.props = props;
}

export class NormalComponent {
	constructor(element) {
		const { props, type } = element;
		Base.call(this, props, type);
		this.name = type.name || type.toString().match(/^function\s*([^\s(]+)/)[1];
		// tag = NODE_TAG.NORMAL_COMPONENT;
		this.tag = NODE_TAG.NORMAL_COMPONENT;
		type.displayName = this.name;
		// Object.freeze(this);
		Object.freeze(props);
	}

	mount(parentContext, parentComponent) {
		readyWorks.add(null, this);
		return mountComponent(this, parentContext, parentComponent);
	}

	update(previous) {
		reRenderComponent(previous, this);
	}

	unmount(parentDom) {
		return unmountComponent(this, parentDom);
	}
}

export class StateLessCompoent {
	constructor(element) {
		const { props, type } = element;
		Base.call(this, props, type);
		this.tagtag = NODE_TAG.STATELESS;
		// Object.freeze(this);
		Object.freeze(props);
	}

	mount(parentContext, parentComponent) {
		return mountStateLessComponent(this, parentContext, parentComponent);
	}

	unmount(parentDom) {
		return unmountStateLessComponent(this, parentDom);
	}
}

export class HostNode {
	constructor(element) {
		const { props, type } = element;
		Base.call(this, props, type);
		this.namespace = props.namespace;
		this.tagtag = NODE_TAG.NODE;
		// Object.freeze(this);
		Object.freeze(props);
	}

	mount(parentContext, parentComponent) {
		return mountVNode(this, parentContext, parentComponent);
	}

	unmount(parentDom) {
		return unmountHostNode(this, parentDom);
	}
}

export class TextNode {
	constructor(element) {
		this.$$typeof = REACT_ELEMENT_TYPE;
		this.text = element || "";
		this.dom = null;
		this.tag = NODE_TAG.TEXT;
		// Object.freeze(this);
	}

	mount() {
		const textNode = (this.dom = window.document.createTextNode(this.text));
		return textNode;
	}

	unmount(parentDom) {
		return unmountTextNode(this, parentDom);
	}
}
